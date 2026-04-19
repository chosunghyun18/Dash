package com.dash.global.security;

import com.dash.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) {
        return loadUserById(Long.parseLong(username));
    }

    public UserDetails loadUserById(Long memberId) {
        memberRepository.findById(memberId)
            .orElseThrow(() -> new UsernameNotFoundException("Member not found: " + memberId));
        return User.builder()
            .username(String.valueOf(memberId))
            .password("")
            .authorities("ROLE_USER")
            .build();
    }
}
