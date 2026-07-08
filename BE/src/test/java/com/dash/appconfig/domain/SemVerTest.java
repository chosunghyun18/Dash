package com.dash.appconfig.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SemVerTest {

    @Test
    @DisplayName("정상 파싱: major.minor.patch")
    void parse_full() {
        assertThat(SemVer.parse("1.2.3")).get()
            .isEqualTo(new SemVer(1, 2, 3));
    }

    @Test
    @DisplayName("누락 파트는 0으로 파싱")
    void parse_missingParts() {
        assertThat(SemVer.parse("1.2")).get().isEqualTo(new SemVer(1, 2, 0));
        assertThat(SemVer.parse("2")).get().isEqualTo(new SemVer(2, 0, 0));
    }

    @Test
    @DisplayName("null/blank/비숫자는 empty")
    void parse_invalid() {
        assertThat(SemVer.parse(null)).isEmpty();
        assertThat(SemVer.parse("")).isEmpty();
        assertThat(SemVer.parse("abc")).isEmpty();
    }

    @Test
    @DisplayName("isLowerThan 비교")
    void compare() {
        SemVer v120 = SemVer.parse("1.2.0").orElseThrow();
        SemVer v130 = SemVer.parse("1.3.0").orElseThrow();
        assertThat(v120.isLowerThan(v130)).isTrue();
        assertThat(v130.isLowerThan(v120)).isFalse();
        assertThat(v120.isLowerThan(v120)).isFalse();
    }
}
