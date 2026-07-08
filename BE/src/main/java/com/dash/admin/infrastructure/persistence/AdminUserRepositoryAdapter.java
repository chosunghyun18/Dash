package com.dash.admin.infrastructure.persistence;

import com.dash.admin.domain.AdminUser;
import com.dash.admin.domain.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AdminUserRepositoryAdapter implements AdminUserRepository {

    private final AdminUserJpaRepository jpa;

    @Override
    public Optional<AdminUser> findByLoginId(String loginId) {
        return jpa.findByLoginId(loginId).map(AdminUserMapper::toDomain);
    }

    @Override
    public Optional<AdminUser> findById(Long id) {
        return jpa.findById(id).map(AdminUserMapper::toDomain);
    }
}
