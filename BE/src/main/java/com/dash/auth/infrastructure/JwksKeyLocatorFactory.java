package com.dash.auth.infrastructure;

import io.jsonwebtoken.Header;
import io.jsonwebtoken.Locator;
import io.jsonwebtoken.ProtectedHeader;
import io.jsonwebtoken.security.Jwk;
import io.jsonwebtoken.security.JwkSet;
import io.jsonwebtoken.security.Jwks;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.security.Key;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * JWKS(제공자 공개키 집합) 기반 서명검증용 {@link Locator} 팩토리.
 *
 * <p>JWKS URI 별로 공개키를 {@code kid → Key} 맵으로 캐시(TTL)하며, JWS 헤더의 {@code kid} 로
 * 서명키를 조회한다. 캐시에 없는 {@code kid}(키 회전 직후)는 1회 강제 재조회한다.
 *
 * <p>HTTP 조회는 {@link JwkSetFetcher} 로 추상화 — 기본 구현은 {@link RestClient} 를 쓰고,
 * 테스트는 in-memory JWKS JSON 을 주입한다.
 */
@Component
public class JwksKeyLocatorFactory {

    /** JWKS URI → JWKS JSON 문자열. */
    @FunctionalInterface
    interface JwkSetFetcher {
        String fetch(String uri);
    }

    /** 공개키 캐시 TTL(1시간) — 제공자 키 회전 주기 대비 짧게. */
    private static final long DEFAULT_TTL_MILLIS = 60 * 60 * 1000L;

    private final JwkSetFetcher fetcher;
    private final long ttlMillis;
    private final Map<String, CachedKeys> cache = new ConcurrentHashMap<>();

    public JwksKeyLocatorFactory() {
        this(defaultFetcher(), DEFAULT_TTL_MILLIS);
    }

    /** 테스트용 — 커스텀 fetcher/TTL 주입. */
    JwksKeyLocatorFactory(JwkSetFetcher fetcher, long ttlMillis) {
        this.fetcher = fetcher;
        this.ttlMillis = ttlMillis;
    }

    /** 주어진 JWKS URI 의 공개키로 서명키를 해석하는 로케이터. */
    public Locator<Key> forUri(String uri) {
        return (Header header) -> {
            if (!(header instanceof ProtectedHeader protectedHeader)) {
                return null;
            }
            String kid = protectedHeader.getKeyId();
            if (kid == null) {
                return null;
            }
            Key key = keys(uri, false).get(kid);
            if (key == null) {
                key = keys(uri, true).get(kid); // 키 회전 대비 강제 갱신 1회
            }
            return key;
        };
    }

    private Map<String, Key> keys(String uri, boolean forceRefresh) {
        CachedKeys cached = cache.get(uri);
        long now = System.currentTimeMillis();
        if (!forceRefresh && cached != null && now - cached.fetchedAt() < ttlMillis) {
            return cached.keys();
        }
        Map<String, Key> parsed = parse(fetcher.fetch(uri));
        cache.put(uri, new CachedKeys(parsed, now));
        return parsed;
    }

    private static Map<String, Key> parse(String jwksJson) {
        JwkSet set = Jwks.setParser().build().parse(jwksJson);
        Map<String, Key> keys = new HashMap<>();
        for (Jwk<?> jwk : set.getKeys()) {
            keys.put(jwk.getId(), jwk.toKey());
        }
        return keys;
    }

    private static JwkSetFetcher defaultFetcher() {
        RestClient client = RestClient.create();
        return uri -> client.get().uri(uri).retrieve().body(String.class);
    }

    private record CachedKeys(Map<String, Key> keys, long fetchedAt) {
    }
}
