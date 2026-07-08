package com.dash.global.web;

import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ApiVersionInterceptorTest {

    private final ApiVersionInterceptor interceptor = new ApiVersionInterceptor();

    private boolean preHandle(String headerValue) {
        MockHttpServletRequest request = new MockHttpServletRequest();
        if (headerValue != null) {
            request.addHeader(ApiVersion.HEADER, headerValue);
        }
        return interceptor.preHandle(request, new MockHttpServletResponse(), new Object());
    }

    @Test
    @DisplayName("지원 major(1) 헤더는 통과")
    void supportedVersion_passes() {
        assertThat(preHandle("1.0.0")).isTrue();
    }

    @Test
    @DisplayName("헤더 누락은 폴백(통과)")
    void missingHeader_fallsBackAndPasses() {
        assertThat(preHandle(null)).isTrue();
    }

    @Test
    @DisplayName("지원하지 않는 major 는 UNSUPPORTED_API_VERSION(400)")
    void unsupportedMajor_throws() {
        assertThatThrownBy(() -> preHandle("2.0.0"))
            .isInstanceOf(BusinessException.class)
            .extracting("errorCode").isEqualTo(ErrorCode.UNSUPPORTED_API_VERSION);
    }

    @Test
    @DisplayName("파싱 불가 버전(major=-1)은 UNSUPPORTED_API_VERSION")
    void unparseableVersion_throws() {
        assertThatThrownBy(() -> preHandle("garbage"))
            .isInstanceOf(BusinessException.class)
            .extracting("errorCode").isEqualTo(ErrorCode.UNSUPPORTED_API_VERSION);
    }
}
