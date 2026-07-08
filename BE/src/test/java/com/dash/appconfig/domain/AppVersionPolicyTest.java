package com.dash.appconfig.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class AppVersionPolicyTest {

    // min=1.2.0, latest=1.5.0
    private AppVersionPolicy policy() {
        return AppVersionPolicy.reconstitute(Platform.IOS, "1.2.0", "1.5.0", "", "", false);
    }

    @Test
    @DisplayName("min 미만이면 FORCE_UPDATE")
    void belowMin_force() {
        assertThat(policy().evaluate("1.1.9")).isEqualTo(UpdateStatus.FORCE_UPDATE);
    }

    @Test
    @DisplayName("min 이상 latest 미만이면 SOFT_UPDATE")
    void betweenMinAndLatest_soft() {
        assertThat(policy().evaluate("1.2.0")).isEqualTo(UpdateStatus.SOFT_UPDATE);
        assertThat(policy().evaluate("1.4.9")).isEqualTo(UpdateStatus.SOFT_UPDATE);
    }

    @Test
    @DisplayName("latest 이상이면 OK")
    void atOrAboveLatest_ok() {
        assertThat(policy().evaluate("1.5.0")).isEqualTo(UpdateStatus.OK);
        assertThat(policy().evaluate("1.6.0")).isEqualTo(UpdateStatus.OK);
    }

    @Test
    @DisplayName("파싱 불가/누락 버전은 OK 로 폴백(fail-open)")
    void unparseable_failOpen() {
        assertThat(policy().evaluate(null)).isEqualTo(UpdateStatus.OK);
        assertThat(policy().evaluate("")).isEqualTo(UpdateStatus.OK);
        assertThat(policy().evaluate("garbage")).isEqualTo(UpdateStatus.OK);
    }
}
