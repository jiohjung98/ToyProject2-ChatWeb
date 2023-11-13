'use client';

import React from 'react';
import styled from 'styled-components';

const Move = () => {
    return (
        <Container>
            <div>
                <img src="/Logo.png" alt="" />
                <div className="shadow"></div>
            </div>
        </Container>
    );
};

export default Move;

const Container = styled.div`
    position: fixed;
    left: 50%;
    transform: translate(-50%, 0);
    width: 800px;
    height: 100vh;
    background: rgba(255, 255, 255, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    div {
        position: relative;

        img {
            width: 100px;
            filter: drop-shadow(9px 7px 6px #c3c3c3);
            margin-bottom: 45px;
            animation: bounce 1s infinite;

            @keyframes bounce {
                0% {
                    transform: translateY(10px)
                    animation-timing-function: ease-in;
                }
                25% {
                    transform: translateY(20px)
                    animation-timing-function: ease-out;
                }
                50% {
                    transform: translateY(30px)
                }
                100%{
                    transform: translateY(35px)
                    animation-timing-function: ease-out;
                }
          
            }
        }
        .shadow {
            position: absolute;
            width: 68px;
            height: 5px;
            left: calc(50% - 28px);
            bottom: 20px;
            border-radius: 100%;
            background-color: rgba(0, 0, 0, 0.2);

            animation: shadow 1s infinite;

            @keyframes shadow {
    0% {
      transform: scale(0.1);
      background-color: rgba(0, 0, 0, 0.1);
  	}
    50% {
      transform: scale(1);
      background-color: rgba(0, 0, 0, 0.2);
    }
    55% {
      transform: scale(1);
      background-color: rgba(0, 0, 0, 0.2);
    }
    65% {
      transform: scale(0.5);
      background-color: rgba(0, 0, 0, 0.15);
    }
    95% {
      transform: scale(0.1);
      background-color: rgba(0, 0, 0, 0.1);
    }
    100% {
      transform: scale(0.1);
      background-color: rgba(0, 0, 0, 0.1);
    }
        }
    }
`;
