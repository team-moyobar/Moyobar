package com.ssafy.config;

import com.ssafy.api.service.UserService;
import com.ssafy.common.auth.JwtAuthenticationFilter;
import com.ssafy.common.auth.SsafyUserDetailService;
import com.ssafy.security.RestAuthenticationEntryPoint;
import com.ssafy.security.TokenAuthenticationFilter;
import com.ssafy.security.oauth2.service.CustomOAuth2UserService;
import com.ssafy.security.oauth2.OAuth2AuthenticationSuccessHandler;
import com.ssafy.security.oauth2.HttpCookieOAuth2AuthorizationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.ssafy.security.oauth2.OAuth2AuthenticationFailureHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * 인증(authentication) 와 인가(authorization) 처리를 위한 스프링 시큐리티 설정 정의.
 */
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true) //AOP 보안 제공. 스프링 시큐리티의 메소드 어노테이션 기반 시큐리티를 활성화 하기 위해서 필요
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    // 1. 일반 회원가입, 로그인용
    @Autowired
    private SsafyUserDetailService ssafyUserDetailService;
    @Autowired
    private UserService userService;

    // 2. 소셜 로그인
    //소셜로그인 관련-Serivice 클래스
    private final CustomOAuth2UserService customOAuth2UserService;

    //소셜로그인 Authentication 성공/실패
    private final OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler;
    private final OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler;

    // Password 인코딩 방식에 BCrypt 암호화 방식 사용
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // DAO 기반으로 Authentication Provider를 생성
    // BCrypt Password Encoder와 UserDetailService 구현체를 설정
    @Bean
    DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        daoAuthenticationProvider.setUserDetailsService(this.ssafyUserDetailService);
        return daoAuthenticationProvider;
    }

    //일반 회원가입, 로그인-DAO 기반의 Authentication Provider가 적용되도록 설정
    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(authenticationProvider());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        //and() 로 나뉨
        http
                .cors() //cors를 적용
                .and()

                .httpBasic().disable()
                .csrf().disable() //disable()의 의미->"/"와 "/main" 경로는 누구나 접근(permitAll)할 수 있도록 한 것이며 그외의 경로는 인증을 한 후에만 접근할 수 있다는 것

                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS) // 토큰 기반 인증이므로 세션 사용 하지않겠다는 것
                .and() //getBuilder() 반환

                .exceptionHandling()
                .authenticationEntryPoint(new RestAuthenticationEntryPoint()) //인증되지 않은 request에는 401 status
                .and()

                .addFilter(new JwtAuthenticationFilter(authenticationManager(), userService)) //HTTP 요청에 JWT 토큰 인증 필터를 거치도록 필터를 추가-jwt로 인증돼야만 이동이 막 가능하도록

                .authorizeRequests()
                .antMatchers("/auth/**", "/oauth2/**")
                .permitAll()
                .antMatchers("/api/v1/users/me")
                .authenticated()
                .anyRequest()
                .permitAll()

                 //me(정보조회)의 경우에는 로그인한 사람만 가능하도록 권한 부여
                //규칙조심...
//                .authorizeRequests()
//                .anyRequest().permitAll() //
//                .antMatchers("/auth/**", "/oauth2/**") //소셜 로그인 위한 허용
//                .permitAll()

                ///oauth2/authorization으로 가서 accesstoken발급
                .and()
                .oauth2Login()
                .authorizationEndpoint()
                .baseUri("/oauth2/authorization")
                .authorizationRequestRepository(cookieAuthorizationRequestRepository()) //Authorization request와 관련된 state가 cookieAuthorizationRequestRepository에 저장됨

                //실제로 server 접속하러 고고
                .and()
                .redirectionEndpoint()
                .baseUri("/*/oauth2/code/*")

                //받아온 User정보를 저장장
               .and()
                .userInfoEndpoint() //is used by an application to retrieve profile information about the Identity that authenticated.
                .userService(customOAuth2UserService) //커스텀한 소셜로그인 로직 처리용 서비스 클래스에 대한

                .and()
                .successHandler(oAuth2AuthenticationSuccessHandler)
                .failureHandler(oAuth2AuthenticationFailureHandler);

        // Add our custom Token based authentication filter-소셜 로그인
        http.addFilterBefore(tokenAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    //소셜 로그인
    //토큰 필터 설정
    @Bean
    public TokenAuthenticationFilter tokenAuthenticationFilter() {
        return new TokenAuthenticationFilter();
    }

    /*
     * By default, Spring OAuth2 uses HttpSessionOAuth2AuthorizationRequestRepository to save the authorization request.
     * But, since our service is stateless, we can't save it in the session.
     * We'll save the request in a Base64 encoded cookie instead.
     * 즉, 세션말고 쿠키에 Authorization request 정보 저장
     */
    @Bean
    public HttpCookieOAuth2AuthorizationRequestRepository cookieAuthorizationRequestRepository() {
        return new HttpCookieOAuth2AuthorizationRequestRepository();
    }

    //oauth-login  코드
//
//    /*
//     * 쿠키 기반 인가 Repository
//     * 인가 응답을 연계 하고 검증할 때 사용.
//     * */
//    @Bean
//    public OAuth2AuthorizationRequestBasedOnCookieRepository oAuth2AuthorizationRequestBasedOnCookieRepository() {
//        return new OAuth2AuthorizationRequestBasedOnCookieRepository();
//    }
//
//
//    /*
//     * auth 매니저 설정
//     * */
//    @Override
//    @Bean(BeanIds.AUTHENTICATION_MANAGER)
//    protected AuthenticationManager authenticationManager() throws Exception {
//        return super.authenticationManager();
//    }
//
//    /*
//     * Oauth 인증 성공 핸들러
//     * */
//    @Bean
//    public OAuth2AuthenticationSuccessHandler oAuth2AuthenticationSuccessHandler() {
//        return new OAuth2AuthenticationSuccessHandler(
//                tokenProvider,
//                appProperties,
//                userRefreshTokenRepository,
//                oAuth2AuthorizationRequestBasedOnCookieRepository()
//        );
//    }
//
//    /*
//     * Oauth 인증 실패 핸들러
//     * */
//    @Bean
//    public OAuth2AuthenticationFailureHandler oAuth2AuthenticationFailureHandler() {
//        return new OAuth2AuthenticationFailureHandler(oAuth2AuthorizationRequestBasedOnCookieRepository());
//    }
//
//    /*
//     * Cors 설정
//     * */
//    @Bean
//    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
//        UrlBasedCorsConfigurationSource corsConfigSource = new UrlBasedCorsConfigurationSource();
//
//        CorsConfiguration corsConfig = new CorsConfiguration();
//        corsConfig.setAllowedHeaders(Arrays.asList(corsProperties.getAllowedHeaders().split(",")));
//        corsConfig.setAllowedMethods(Arrays.asList(corsProperties.getAllowedMethods().split(",")));
//        corsConfig.setAllowedOrigins(Arrays.asList(corsProperties.getAllowedOrigins().split(",")));
//        corsConfig.setAllowCredentials(true);
//        corsConfig.setMaxAge(corsConfig.getMaxAge());
//
//        corsConfigSource.registerCorsConfiguration("/**", corsConfig);
//        return corsConfigSource;
//    }
}