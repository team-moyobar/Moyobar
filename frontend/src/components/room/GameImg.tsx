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
            <h2>ππΌββοΈ λΌμ΄μ΄ κ²μ</h2>
            <img className="slider-img" src="/images/room/liar1.png" alt="" />
            <h2>μ­ν </h2>
            <div>λΌμ΄μ΄ 1λͺκ³Ό λλ¨Έμ§ μΈμμ νλ μ΄μ΄λ‘ κ΅¬μ±</div>
            <div>μλ‘κ° μ΄λ€ μ­ν μ λ§‘μ κ²μΈμ§ μμμμ</div>
          </div>
          <div className="gametu">
            <h2>ππΌββοΈ λΌμ΄μ΄ κ²μ</h2>
            <img className="slider-img" src="/images/room/liar2.png" alt="" />
            <h2>κ·μΉ</h2>
            <div>νλ μ΄μ΄λ μ μμ΄, λΌμ΄μ΄λ μ£Όμ λ₯Ό λ°μ</div>
            <div>3λΆ λ΄μ λΌμ΄μ΄ μΌ κ² κ°μ μ¬λμ ν¬ν</div>
            <div>ν¬ν κ²°κ³Ό λΌμ΄μ΄ μ§λͺ© μ νλ μ΄μ΄ μΉλ¦¬</div>
          </div>
          <div className="gametu">
            <h2>πββοΈ μλ€μ΄ κ²μ</h2>
            <img className="slider-img" src="/images/room/up.png" alt="" />
            <h2>κ·μΉ</h2>
            <div>
              κ²μ μμμ μ λ΅μΈ μ«μλ 1 ~ 100 μ¬μ΄μ κ°μΌλ‘ μμλ‘ λ°°μ 
            </div>
            <div>μ¬μ©μκ° 10μ΄ μμ 1 ~ 100 μ¬μ΄μ μ«μλ₯Ό μλ ₯</div>
            <div>μλ ₯ν μ«μκ° μ λ΅μΈ κ²½μ° ν΄λΉ νλ μ΄μ΄ μΉλ¦¬</div>
          </div>
          <div className="gametu">
            <h2>πββοΈ μ΄μ± ν΄μ¦</h2>
            <img className="slider-img" src="/images/room/init.png" alt="" />
            <h2>κ·μΉ</h2>
            <div>κ²μ μμμ μ΄μ±μ μμλ‘ λ°°μ </div>
            <div>μ¬μ©μκ° μμ±μΈμμ ν΅ν΄ μ΄μ±μ ν΄λΉλλ λ¨μ΄ μλ ₯</div>
            <div>
              μλ ₯ν λ¨μ΄κ° μ³μ§ μμ λ¨μ΄ μ΄κ±°λ μ΄λ―Έ λμ¨ λ¨μ΄ μ΄λ©΄ κ²μ μ’λ£
            </div>
          </div>
        </Slider>
      </div>
    );
  }
}
