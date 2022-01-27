package com.ssafy.api.service;

import com.ssafy.api.request.UserChangePwdPutReq;
import com.ssafy.common.exception.ErrorCode;
import com.ssafy.common.exception.InvalidValueException;
import com.ssafy.api.request.UserUpdatePutReq;
import com.ssafy.common.exception.RoomNotFoundException;
import com.ssafy.common.exception.UserNotFoundException;
import com.ssafy.db.entity.Drink;
import com.ssafy.db.entity.Room;
import com.ssafy.db.repository.DrinkRepository;
import com.ssafy.security.UserPrincipal;
import com.ssafy.security.oauth2.entity.ProviderType;
import lombok.extern.slf4j.Slf4j;
import com.ssafy.api.response.UserRes;

import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.db.entity.User;
import com.ssafy.db.repository.UserRepository;
import com.ssafy.db.repository.UserRepositorySupport;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * 유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 * 주량 관련 비즈니스 로직도 함께 정의.
 */
@Slf4j //log함수용
@Service("userService")
public class UserServiceImpl implements UserService {
    @Autowired
    UserRepository userRepository;
    @Autowired
    DrinkRepository drinkRepository;

    @Autowired
    UserRepositorySupport userRepositorySupport;

    @Autowired
    PasswordEncoder passwordEncoder;

    // 온라인 유저 리스트
    ArrayList<String> userOnlineList = new ArrayList<>();

    @Override
    public User createUser(UserRegisterPostReq userRegisterInfo) {
        User user = new User();
        user.setUserId(userRegisterInfo.getUserId());
        // 보안을 위해서 유저 패스워드 암호화 하여 디비에 저장.
        if (userRegisterInfo.getType() == ProviderType.LOCAL)
            user.setPassword(passwordEncoder.encode(userRegisterInfo.getPassword()));
        user.setNickname(userRegisterInfo.getNickname());
        user.setBirthday(userRegisterInfo.getBirthday());
        user.setPhone(userRegisterInfo.getPhone());
        user.setType(userRegisterInfo.getType());

        Drink drink = new Drink();
        if (userRegisterInfo.getDrink() != null) {
            drink.setBeer(userRegisterInfo.getDrink().getBeer());
            drink.setSoju(userRegisterInfo.getDrink().getSoju());
            drink.setLiquor(userRegisterInfo.getDrink().getLiquor());
        }
        user.setDrink(drink);
        return userRepository.save(user);
    }

    @Override
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User updateUser(UserUpdatePutReq userUpdatePutReq, User user) {
        //닉네임 수정
        if (userUpdatePutReq.getNickname() != null) {
            user.setNickname(userUpdatePutReq.getNickname());
        }

        //이미지 수정
        if (userUpdatePutReq.getImg() != null) {
            user.setImg(userUpdatePutReq.getImg());
        }

        //주량정보 수정
        if (userUpdatePutReq.getDrink() != null) {
            //현재 유저의 drink값을 찾아 해당 유저의 Drink table값 수정하기
            Drink drink = user.getDrink();
            drink.setBeer(userUpdatePutReq.getDrink().getBeer());
            drink.setSoju(userUpdatePutReq.getDrink().getSoju());
            drink.setLiquor(userUpdatePutReq.getDrink().getLiquor());
            drinkRepository.save(drink); //Drink table update 후에
            user.setDrink(drink); //User table에 반영
        }

        return userRepository.save(user);
    }

    @Override
    public boolean idDuplicated(String userId) {
        return userRepository.existsByUserId(userId);
    }

    @Override
    public boolean nicknameDuplicated(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    @Override
    public void addUserOnline(String userId) {
        // 온라인 유저 추가
        userOnlineList.add(userId);
    }

    @Override
    public List<UserRes> getUsersOnlineList() {
        List<UserRes> res = new ArrayList<>();
        // DB에서 유저 ID에 해당하는 유저리스트를 불러옴
        for (String userId : userOnlineList) {
            res.add(UserRes.of(userRepository.findByUserId(userId).get()));
        }

        return res;
    }

    @Override
    public User getUserByUserId(String userId) {
        // 디비에 유저 정보 조회 (userId 를 통한 조회).
        User user = userRepository.findByUserId(userId).get();
        return user;
    }

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByUserId(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email : " + email));

        log.info("Load user by user email: the User Email - {}", user.getUserId());

        return UserPrincipal.create(user);
    }

    @Override
    public boolean changeUserPwd(String userId, String password, String newpassword) {
        User user = userRepository.findByUserId(userId).get();

        //현재 비밀번호를 받아와 DB에 저장된 내용과 일치하는지를 확인한 후에,
        boolean check = passwordEncoder.matches(password, user.getPassword());

        // 해당 유저의 비밀번호를 새 비밀번호값으로 변경하여 저장(암호화 후에)
        if (check) {
            user.setPassword(passwordEncoder.encode(newpassword));
            userRepository.save(user);
        }
        return check;
    }

    @Override
    public User getUserByNickname(String nickname) {
        return userRepository.findByNickname(nickname).orElseThrow(UserNotFoundException::new);
    }
}