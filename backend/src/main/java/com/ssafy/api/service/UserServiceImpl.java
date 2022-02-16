package com.ssafy.api.service;

import com.ssafy.api.request.UserUpdatePutReq;
import com.ssafy.api.response.UserLogRes;
import com.ssafy.common.exception.UserNotFoundException;
import com.ssafy.db.entity.room.ActionType;
import com.ssafy.db.entity.user.Drink;
import com.ssafy.db.repository.room.HistoryRepository;
import com.ssafy.db.repository.user.DrinkRepository;
import com.ssafy.security.UserPrincipal;
import com.ssafy.security.oauth2.entity.ProviderType;
import lombok.extern.slf4j.Slf4j;
import com.ssafy.api.response.UserRes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ssafy.api.request.UserRegisterPostReq;
import com.ssafy.db.entity.user.User;
import com.ssafy.db.repository.user.UserRepository;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 유저 관련 비즈니스 로직 처리를 위한 서비스 구현 정의.
 * 주량 관련 비즈니스 로직도 함께 정의.
 */
@Slf4j //log함수용
@Service("userService")
public class UserServiceImpl implements UserService {

    @Value("${moyobar.profile.default}")
    private String DEFAULT_PATH;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DrinkRepository drinkRepository;
    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 온라인 유저 리스트
    private final HashSet<String> userOnlineSet = new HashSet<>();

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

        if (userRegisterInfo.getDescription() != null){
            user.setDescription(userRegisterInfo.getDescription());
        }

        user.setImg(DEFAULT_PATH);
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

        // 자기소개 수정
        if (userUpdatePutReq.getDescription() != null){
            user.setDescription(userUpdatePutReq.getDescription());
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
        // 접속중인 유저 추가
        userOnlineSet.add(userId);
    }

    @Override
    public boolean delUserOnline(String userId){
        // 접속중인 유저 삭제
        return userOnlineSet.remove(userId);
    }

    @Override
    public List<UserRes> getUsersOnlineList() {
        List<UserRes> res = new ArrayList<>();
        // DB에서 유저 ID에 해당하는 유저리스트를 불러옴
        for (String userId : userOnlineSet) {
            res.add(UserRes.of(getUserByUserId(userId)));
        }

        return res;
    }

    @Override
    public User getUserByUserId(String userId) {
        // 디비에 유저 정보 조회 (userId 를 통한 조회).
        return userRepository.findByUserId(userId).orElseThrow(UserNotFoundException::new);
    }

    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByUserId(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email : " + email));

        log.info("Load user by user email: the User Email - {}", user.getUserId());

        return UserPrincipal.create(user);
    }

    @Override
    public boolean changeUserPwd(String userId, String password, String newpassword) {
        User user = getUserByUserId(userId);

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

    @Override
    public List<User> searchUserByNickname(String keyword) {
        return userRepository.findByNicknameContainingIgnoreCase(keyword);
    }

    @Override
    public List<UserLogRes> getUserLogs(String nickname) {
        Map<String, UserLogRes> temp = new HashMap<>();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        User user = getUserByNickname(nickname);

        historyRepository.findAllByUserIdAndAction(user.getId(), ActionType.EXIT)
                .forEach(history -> {

                    long min = (history.getExited().getTime() - history.getInserted().getTime()) / 60000;

                    String str = format.format(history.getInserted());

                    if (!temp.containsKey(str)) {
                        UserLogRes log = new UserLogRes();
                        try {
                            log.setDate(format.parse(str));
                        } catch (ParseException e) {
                            e.printStackTrace();
                        }
                        temp.put(str, log);
                    }

                    UserLogRes res = temp.get(str);

                    res.setCount(res.getCount() + 1);
                    res.setElapsedTime(res.getElapsedTime() + min);
                });

        return new ArrayList<>(temp.values());
    }
}