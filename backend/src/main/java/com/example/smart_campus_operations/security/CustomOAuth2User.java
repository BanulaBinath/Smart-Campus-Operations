package com.example.smart_campus_operations.security;

import com.example.smart_campus_operations.entity.AppUser;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.UUID;

public class CustomOAuth2User implements OAuth2User {

    private final AppUser appUser;
    private final Map<String, Object> attributes;

    public CustomOAuth2User(AppUser appUser, Map<String, Object> attributes) {
        this.appUser = appUser;
        this.attributes = attributes;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return attributes;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singleton(new SimpleGrantedAuthority("ROLE_" + appUser.getRole().name()));
    }

    @Override
    public String getName() {
        return appUser.getEmail();
    }

    public UUID getId() {
        return appUser.getId();
    }

    public AppUser getAppUser() {
        return appUser;
    }
}
