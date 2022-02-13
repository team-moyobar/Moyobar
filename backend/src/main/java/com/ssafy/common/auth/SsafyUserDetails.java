package com.ssafy.common.auth;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.ssafy.db.entity.user.User;

/**
 * 현재 액세스 토큰으로 부터 인증된 유저의 부가 상세정보(활성화 여부, 만료, 롤 등) 정의.
 */
public class SsafyUserDetails implements UserDetails {
	@Autowired
	User user;
	boolean accountNonExpired;
	boolean accountNonLocked;
	boolean credentialNonExpired;
	boolean enabled = false;
	List<GrantedAuthority> roles = new ArrayList<>();

	//ROLE 부여-ADMIN, USER 등등. 우리 서비스는 USER만 존재함
	public void setAuthorities(List<GrantedAuthority> roles) {
		this.roles = roles;
	}

	public SsafyUserDetails(User user) {
		super();
		this.user = user;
	}

	public User getUser() {
		return this.user;
	}

	@Override
	public String getPassword() {
		return this.user.getPassword();
	}

	@Override
	public String getUsername() {
		return this.user.getUserId();
	}

	//계정 만료되었는지 여부 리턴
	@Override
	public boolean isAccountNonExpired() {
		return this.accountNonExpired;
	}

	//계정 잠금 여부 리턴
	@Override
	public boolean isAccountNonLocked() {
		return this.accountNonLocked;
	}

	//계정 비밀번호가 유효하니 여부 리턴
	@Override
	public boolean isCredentialsNonExpired() {
		return this.credentialNonExpired;
	}

	//해당 계정 활성화여부 리턴=>예를 들어, 휴면계정의 경우에 사용하는 함수
	@Override
	public boolean isEnabled() {
		return this.enabled;
	}

	//해당 User의 권한을 리턴하는 곳(ADMIN, USER 등등)
	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return this.roles;
	}
}