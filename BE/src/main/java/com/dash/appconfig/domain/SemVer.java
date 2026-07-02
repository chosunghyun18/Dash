package com.dash.appconfig.domain;

import java.util.Optional;

/**
 * semver(major.minor.patch) 값 객체. 누락된 파트는 0으로 관대하게 파싱한다("1.2" → 1.2.0).
 * 숫자로 파싱할 수 없는 문자열은 empty — 호출부가 fail-open(OK)으로 폴백한다.
 */
public record SemVer(int major, int minor, int patch) implements Comparable<SemVer> {

    public static Optional<SemVer> parse(String raw) {
        if (raw == null || raw.isBlank()) {
            return Optional.empty();
        }
        String[] parts = raw.trim().split("\\.");
        try {
            int major = parsePart(parts, 0);
            int minor = parsePart(parts, 1);
            int patch = parsePart(parts, 2);
            return Optional.of(new SemVer(major, minor, patch));
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
    }

    private static int parsePart(String[] parts, int index) {
        if (index >= parts.length || parts[index].isBlank()) {
            return 0; // 누락 파트는 0
        }
        return Integer.parseInt(parts[index].trim());
    }

    @Override
    public int compareTo(SemVer other) {
        if (major != other.major) return Integer.compare(major, other.major);
        if (minor != other.minor) return Integer.compare(minor, other.minor);
        return Integer.compare(patch, other.patch);
    }

    public boolean isLowerThan(SemVer other) {
        return compareTo(other) < 0;
    }
}
