package com.dash.global.web;

import com.dash.global.exception.BusinessException;
import com.dash.global.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * {@code X-API-Version} 헤더 기반 버전 협상 인터셉터.
 * 헤더 누락 시 현재 버전으로 폴백(통과), 지원하지 않는 major 는
 * {@link BusinessException}(400) — GlobalExceptionHandler 가 ErrorResponse 로 변환.
 */
@Component
public class ApiVersionInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String header = request.getHeader(ApiVersion.HEADER);
        if (ApiVersion.majorOf(header) != ApiVersion.SUPPORTED_MAJOR) {
            throw new BusinessException(ErrorCode.UNSUPPORTED_API_VERSION);
        }
        return true;
    }
}
