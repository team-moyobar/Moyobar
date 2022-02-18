import React, { Component } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./GameImg.css";
export default class SimpleSlider extends Component {
  render() {
    const settings = {
      dots: true,
      infinite: false,
      speed: 200,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false,
    };
    return (
      <div className="slider-container">
        <Slider {...settings}>
          <div className="gametu">
            <h2>🙋🏼‍♀️ 라이어 게임</h2>
            <img className="slider-img" src="/images/room/liar1.png" alt="" />
            <h2>역할</h2>
            <div>라이어 1명과 나머지 인원은 플레이어로 구성</div>
            <div>서로가 어떤 역할을 맡은 것인지 알수없음</div>
          </div>
          <div className="gametu">
            <h2>🙋🏼‍♀️ 라이어 게임</h2>
            <img className="slider-img" src="/images/room/liar2.png" alt="" />
            <h2>규칙</h2>
            <div>플레이어는 제시어, 라이어는 주제를 받음</div>
            <div>3분 내에 라이어 일 것 같은 사람을 투표</div>
            <div>투표 결과 라이어 지목 시 플레이어 승리</div>
          </div>
          <div className="gametu">
            <h2>🙋‍♂️ 업다운 게임</h2>
            <img className="slider-img" src="/images/room/up.png" alt="" />
            <h2>규칙</h2>
            <div>
              게임 순서와 정답인 숫자는 1 ~ 100 사이의 값으로 임의로 배정
            </div>
            <div>사용자가 10초 안에 1 ~ 100 사이의 숫자를 입력</div>
            <div>입력한 숫자가 정답인 경우 해당 플레이어 승리</div>
          </div>
          <div className="gametu">
            <h2>🙋‍♀️ 초성 퀴즈</h2>
            <img className="slider-img" src="/images/room/init.png" alt="" />
            <h2>규칙</h2>
            <div>게임 순서와 초성은 임의로 배정</div>
            <div>사용자가 음성인식을 통해 초성에 해당되는 단어 입력</div>
            <div>
              입력한 단어가 옳지 않은 단어 이거나 이미 나온 단어 이면 게임 종료
            </div>
          </div>
        </Slider>
      </div>
    );
  }
}
