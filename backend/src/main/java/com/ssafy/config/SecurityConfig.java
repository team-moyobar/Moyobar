package com.ssafy.config;

import com.ssafy.api.service.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.SsafyUserDetailService;
import com.ssafy.common.auth.JwtAuthenticationFilter;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;

import com.ssafy.security.RestAuthenticationEntryPoint;
import com.ssafy.security.oauth2.service.CustomOAuth2UserService;
import com.ssafy.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;

import com.ssafy.security.oauth2.handler.OAuth2AuthenticationSuccessHandler;
import com.ssafy.security.oauth2.handler.OAuth2AuthenticationFailureHandler;

import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;

/**
 * 인증(authentication) 와 인가(authorization) 처리를 위한 스프링 시큐리티 설정 정의.
 */
@Configuration
@EnableWebSecurity //Spring Security 활성화-스프링 시큐리티 필터가 스프링 필터체인에 등록됨
@EnableGlobalMethodSecurity(prePostEnabled = true) //AOP 보안 제공. 스프링 시큐리티의 메소드 어노테이션 기반 시큐리티를 활성화 하기 위해서 필요. preAuthorization활성화
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private SsafyUserDetailService ssafyUserDetailService;
    @Autowired
    private UserService userService;

    //소셜로그인 관련-OAuth2 기반으로 작동한 후 UserDB에 INSERT
    private final CustomOAuth2UserService customOAuth2UserService;

    //소셜로그인 Authentication 성공/실패
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;

    private final HttpCookieOAuth2AuthorizationRequestRepository httpCookieOAuth2AuthorizationRequestRepository;

    //쿠키에 Authorization request 정보 저장
    @Bean
    public HttpCookieOAuth2AuthorizationRequestRepository cookieAuthorizationRequestRepository() {
        return new HttpCookieOAuth2AuthorizationRequestRepository();
    }
    // Password 인코딩 방식에 BCrypt 암호화 방식 사용
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 일반 로그인
    // DAO 기반으로 Authentication Provider를 생성
    // BCrypt Password Encoder와 UserDetailService 구현체를 설정
    @Bean
    DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        daoAuthenticationProvider.setUserDetailsService(this.ssafyUserDetailService);
        return daoAuthenticationProvider;
    }

    //DAO 기반의 Authentication Provider가 적용되도록 설정
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception{
        auth.authenticationProvider(authenticationProvider());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .cors() //cors를 허용
                .and()
                .httpBasic().disable() //헤더에 basic oauth값이 오는데 이를 막음
                .csrf().disable() //"/"와 "/main" 경로는 누구나 접근가능하나 그외의 경로는 인증허가시에만 접근 가능. csrf 토큰 받지 않음

                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // 토큰 기반 인증(세션사용X)
                .and()

                .exceptionHandling()
                .authenticationEntryPoint(new RestAuthenticationEntryPoint()) //인증되지 않은 request에는 401 status
                .and()

                //.addFilter(new JwtAuthenticationFilter(authenticationManager(), userService)) //HTTP 요청에 JWT 토큰 인증 필터를 거치도록 필터를 추가

                .authorizeRequests() //url 접근 권한 설정
                .antMatchers("/auth/**", "/oauth2/**") //해당 request는
                .permitAll() //아무나 접근 가능

                .antMatchers("/api/v1/users/info", "/api/v1/rooms/**","/api/v1/users/online", "/api/v1/rank/**") //해당 request는
                .authenticated() //인증허가된 사용자만 접근 가능

                .anyRequest() //그 외의 request에 대해서는
                .permitAll() //모두 접근 가능

                //Authorization Server
                .and()
                .oauth2Login() //로그인 창에서 로그인 및 사용자 동의 얻은 후
                .authorizationEndpoint() //인증 요청 받으면
                .baseUri("/api/oauth2/authorization") //해당 url(provider별 AuthorizationURl)로 redirect
                .authorizationRequestRepository(cookieAuthorizationRequestRepository()) //authorization request 관련 state 저장

                //Resource Server
                .and()
                .redirectionEndpoint() //아래 url로 redirect
                .baseUri("/*/oauth2/code/*") //authorization code(resource server 접근용) 갖고 resource server로 이동

                //받아온 User 정보를 통해 회원정보 조회
                .and()
                .userInfoEndpoint()
                .userService(customOAuth2UserService) //커스텀한 소셜로그인 로직 처리용 클래스-회원가입하기 or 로그인하기

                .and()
                .successHandler(oAuth2AuthenticationSuccessHandler) //jwt authentication token 생성
                .failureHandler(oAuth2AuthenticationFailureHandler); //에러

        // Add our custom Token based authentication filter
        http.addFilterBefore(new JwtAuthenticationFilter(authenticationManager(), userService), UsernamePasswordAuthenticationFilter.class);
    }

    //소셜 로그인 JSESSION 발급 시 요청 URI에 ; 들어가도 허용하도록 변경
    @Bean
    public HttpFirewall getHttpFirewall() {
        StrictHttpFirewall strictHttpFirewall = new StrictHttpFirewall();
        strictHttpFirewall.setAllowSemicolon(true);
        return strictHttpFirewall;
    }
}