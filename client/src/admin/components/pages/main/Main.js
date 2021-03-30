import React from "react";
import "./Main.css";
import Chart from "../charts/Chart";
import { TeamOutlined } from "@ant-design/icons";

const Main = () => {
  return (
    <main>
      <div className="main__container">
        <div className="main__title">
          {/* <img src={he} alt="hello" /> */}
          <div className="main__greeting">
            <h1>Hello World</h1>
            <p>Welcome to your admin dashboard</p>
          </div>
        </div>

        <div className="main__cards">
          <div className="card">
            {/* <i className="fa fa-user-o fa-2x text-lighblue"></i> */}
            <TeamOutlined />
            <div className="card_inner">
              <p className="text-primary-p">Number of Registers</p>
              <span className="font-bold text-title">583</span>
            </div>
          </div>

          <div className="card">
            <i className="fa fa-calendar fa-2x text-red"></i>
            <div className="card_inner">
              <p className="text-primary-p">Number of Bought Plans</p>
              <span className="font-bold text-title">1223</span>
            </div>
          </div>

          <div className="card">
            <i className="fa fa-video-camera fa-2x text-yellow"></i>
            <div className="card_inner">
              <p className="text-primary-p">Number of Active Login</p>
              <span className="font-bold text-title">340</span>
            </div>
          </div>

          <div className="card">
            <i className="fa fa-thumbs-up fa-2x text-green"></i>
            <div className="card_inner">
              <p className="text-primary-p">Number of </p>
              <span className="font-bold text-title">56</span>
            </div>
          </div>
        </div>

        <div className="charts">
          <div className="charts__left">
            <div className="charts__left__title">
              <div>
                <h1>Daily Reports</h1>
                <p>Boeung Kork, Phnom Penh, Cambodia</p>
              </div>
              <i className="fa fa-usd"></i>
            </div>
            <Chart />
          </div>

          <div className="charts__right">
            <div className="charts__right__title">
              <div>
                <h1>Status Reports</h1>
                <p>Boeung Kork, Phnom Penh, Cambodia</p>
              </div>
              <i className="fa fa-usd"></i>
            </div>

            <div className="charts__right__cards">
              <div className="card1">
                <h1>Income</h1>
                <p>$189</p>
              </div>
              <div className="card2">
                <h1>Sales</h1>
                <p>$123,300</p>
              </div>
              <div className="card3">
                <h1>Users</h1>
                <p>390</p>
              </div>
              <div className="card4">
                <h1>Orders</h1>
                <p>2189</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Main;
