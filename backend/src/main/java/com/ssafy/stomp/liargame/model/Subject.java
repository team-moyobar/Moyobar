package com.ssafy.stomp.liargame.model;

import lombok.Getter;

import java.util.*;

/**
 * 제시어 정의 : 일반 유저와 라이어의 제시어가 겹치지 않도록 하기
 */

@Getter
public class Subject {
    private List<String> subjects; //제시어

    public Subject(String theme){
        this.subjects = wordMap.get(theme);
    }

    private Map<String, List<String>> wordMap
            = new HashMap<String, List<String>>() {
        {
            put("동물", animal);
            put("나라", country);
            put("음식", food);
            put("영화", movie);
        }
    };

    static List<String> animal = new ArrayList<>(Arrays.asList(new String[]
            {
                    "두더지","개","개미핥기","원숭이","고라니","고래","고릴라","고슴도치","고양이","곰",
                    "기린","나무늘보","낙타","날다람쥐","너구리","늑대","다람쥐","당나귀","돌고래","돼지",
                    "말","멧돼지","물개","바다표범","박쥐","반달가슴곰","북극곰","북극여우",
                    "불독","사막여우","사슴","사자","생쥐","수달","스컹크","알파카","여우","염소",
                    "오랑우탄","오소리","원숭이","족제비","청설모","치와와","치타","침팬지","캥거루","코끼리",
                    "코뿔소","코알라","토끼","펭귄","표범","호랑이", "소", "양"
            }));

    static List<String> country = new ArrayList<>(Arrays.asList(new String[]
            {
                    "그리스", "가나", "네팔", "노르웨이", "나이지리아", "뉴질랜드", "남아프리카 공화국", "대한민국",
                    "덴마크", "독일", "라오스", "러시아", "룩셈부르크",
                    "마다가스카르", "말레이시아", "멕시코", "몰디브", "몽골", "미국", "베네수엘라",
                    "베트남", "벨기에", "브라질", "북한", "스위스", "스웨덴", "스페인", "싱가포르", "아르헨티나",
                    "아프가니스탄", "영국", "이집트", "이탈리아", "인도", "일본", "중국", "캐나다",
                    "태국", "터키", "프랑스", "핀란드", "필리핀", "호주"
            }));

    static List<String> food = new ArrayList<>(Arrays.asList(new String[]
            {
                    "샌드위치", "파스타", "스시", "라면", "피자", "치킨", "케밥", "아구찜", "와플", "타코야끼", "짬뽕", "삼겹살",
                    "짜장", "쌀국수", "곱창", "불고기", "비빔밥", "오므라이스", "냉면", "떡볶이", "보쌈", "족발", "감자탕", "삼계탕", "샤브샤브",
                    "전", "김치찌개", "부대찌개", "된장찌개", "청국장", "간장게장", "양념게장", "어묵(오뎅)", "카레", "돈까스", "추어탕",
                    "우동", "갈비찜", "만두", "케이크", "마라탕", "양꼬치", "스테이크", "햄버거", "핫도그", "피자", "꿔바로우",
                    "수제비", "김밥", "죽", "토스트", "닭갈비", "제육볶음", "육개장", "마카롱", "츄러스", "순대", "새우튀김", "과메기", "오코노미야끼", "골뱅이무침",
                    "삼계탕", "닭발", "사시미", "닭꼬치", "아이스크림", "치즈스틱", "고구마맛탕", "수박화채", "빙수", "설렁탕", "찜닭"
            }));

    static List<String> movie = new ArrayList<>(Arrays.asList(new String[]
            {
                    "인터스텔라", "택시운전사", "설국열차", "해적: 바다로 간 산적", "어벤져스", "아바타", "타이타닉", "스타워즈", "쥬라기 월드", "분노의 질주",
                    "겨울왕국", "해리 포터", "미녀와 야수", "인크레더블", "수상한 그녀", "변호인", "관상", "알라딘", "광해, 왕이 된 남자", "부산행", "해운대", "괴물",
                    "아이언맨", "미니언즈", "캡틴 아메리카", "아쿠아맨", "트랜스포머", "다크 나이트 라이즈", "토이 스토리", "캐리비안의 해적", "스파이더맨",
                    "나니아 연대기", "반지의 제왕", "라이온 킹", "하울의 움직이는 성", "니모를 찾아서", "사운드 오브 뮤직", "ET", "명량", "밀정", "써니",
                    "극한직업", "터널", "너의 이름은", "신과함께", "국제시장", "베테랑", "도둑들", "7번방의 선물", "암살", "왕의 남자", "인셉션", "기생충",
                    "보헤미안 랩소디", "검사외전", "엑시트", "내부자들", "국가대표", "디워", "히말라야", "미션 임파서블", "테이큰", "인천상륙작전", "나홀로 집에",
                    "말할 수 없는 비밀", "신비한 동물사전", "타이타닉", "매트릭스", "라라랜드", "투모로우"
            }));
}