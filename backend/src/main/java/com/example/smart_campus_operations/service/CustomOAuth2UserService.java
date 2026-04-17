package com.example.smart_campus_operations.service;

import com.example.smart_campus_operations.entity.AppUser;
import com.example.smart_campus_operations.entity.Role;
import com.example.smart_campus_operations.repository.UserRepository;
import com.example.smart_campus_operations.security.CustomOAuth2User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String profilePicture = (String) attributes.get("picture");
        String providerId = (String) attributes.get("sub");
        String provider = userRequest.getClientRegistration().getRegistrationId().toUpperCase();

        AppUser user = userRepository.findByEmail(email)
                .map(existingUser -> updateExistingUser(existingUser, name, profilePicture, providerId, provider))
                .orElseGet(() -> registerNewUser(email, name, profilePicture, providerId, provider));

        return new CustomOAuth2User(user, attributes);
    }

    private AppUser registerNewUser(String email, String name, String profilePicture, String providerId, String provider) {
        AppUser user = AppUser.builder()
                .email(email)
                .name(name)
                .profilePicture(profilePicture)
                .providerId(providerId)
                .provider(provider)
                .role(Role.USER) // Default role
                .build();
        return userRepository.save(user);
    }

    private AppUser updateExistingUser(AppUser existingUser, String name, String profilePicture, String providerId, String provider) {
        existingUser.setName(name);
        existingUser.setProfilePicture(profilePicture);
        existingUser.setProviderId(providerId);
        existingUser.setProvider(provider);
        return userRepository.save(existingUser);
    }
}
