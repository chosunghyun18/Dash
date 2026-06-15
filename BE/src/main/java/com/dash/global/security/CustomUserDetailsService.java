package com.dash.global.security;

import com.dash.member.domain.MemberId;
import com.dash.member.domain.MemberRepository;
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
        if (!memberRepository.existsById(MemberId.of(memberId))) {
            throw new UsernameNotFoundException("Member not found: " + memberId);
        }
        return User.builder()
            .username(String.valueOf(memberId))
            .password("")
            .authorities("ROLE_USER")
            .build();
    }
}
