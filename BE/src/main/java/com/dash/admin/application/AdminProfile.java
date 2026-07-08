package com.dash.admin.application;

import com.dash.admin.domain.AdminRole;

public record AdminProfile(Long id, String loginId, String name, AdminRole role) {
}
