"use client";

import { Home, ScanLine } from "lucide-react";
import React, { useState } from "react";
import { RiCustomerService2Line } from "react-icons/ri";
import { BiSolidOffer } from "react-icons/bi";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";

export function BottomNav() {
  const scannerIndex = 2;
  const [activeIconIndex, setActiveIconIndex] = useState(scannerIndex);

  const navItems = [
    { label: "Home", Icon: Home, path: "/" },
    { label: "Help", Icon: RiCustomerService2Line, path: "/chat" },
    { label: "Scanner", Icon: ScanLine, path: "/scan" },
    { label: "Offer", Icon: BiSolidOffer, path: "/offers" },
    { label: "More", Icon: FiMenu, path: "/more" },
  ];

  const IndicatorIcon = ScanLine;

  return (
    <div className="rm-bottom-nav fixed inset-x-0 bottom-3 z-50 px-2 md:hidden" aria-label="Bottom navigation">
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Poppins:100,200,300,400,500,600,700,800,900');

        .rm-bottom-nav {
          --clr: #f7f7f7;
          --item-size: 70px;
          --item-gap: 8px;
          --nav-width: 400px;
          --nav-scale: min(1, calc((100vw - 16px) / var(--nav-width)));
        }

        .rm-bottom-nav * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        .rm-bottom-nav .navigation-shell {
          width: var(--nav-width);
          height: calc(var(--item-size) * var(--nav-scale));
          margin-inline: auto;
          display: flex;
          align-items: flex-start;
          justify-content: center;
        }

        .rm-bottom-nav .navigation {
          position: relative;
          width: var(--nav-width);
          height: var(--item-size);
          background: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transform: scale(var(--nav-scale));
          transform-origin: top center;
        }

        .rm-bottom-nav .navigation ul {
          display: flex;
          width: calc((var(--item-size) * 5) + (var(--item-gap) * 4));
          gap: var(--item-gap);
        }

        .rm-bottom-nav .navigation ul li {
          position: relative;
          list-style: none;
          width: var(--item-size);
          height: var(--item-size);
          z-index: 1;
        }

        .rm-bottom-nav .navigation ul li .nav-button {
          position: relative;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-direction: column;
          width: 100%;
          height: 100%;
          padding-top: 12px;
          gap: 6px;
          border: 0;
          background: transparent;
          cursor: pointer;
          text-align: center;
          font-weight: 500;
          text-decoration: none;
        }

        .rm-bottom-nav .navigation ul li .nav-button .icon {
          line-height: 1;
          transition: 0.35s;
          color: #333;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .rm-bottom-nav .navigation ul li .nav-button .icon.icon-active {
          color: #3b82f6;
        }

        .rm-bottom-nav .navigation ul li:hover .nav-button .icon {
          transform: translateY(-3px);
        }

        .rm-bottom-nav .navigation ul li.active .nav-button .icon {
          opacity: 0;
        }

        .rm-bottom-nav .navigation ul li .nav-button .text {
          position: static;
          color: #333;
          font-size: 0.7em;
          letter-spacing: 0.03em;
          line-height: 1;
          transition: color 0.3s;
          opacity: 1;
          transform: none;
        }

        .rm-bottom-nav .navigation ul li.active .nav-button .text {
          color: #333;
          font-weight: 500;
        }

        .rm-bottom-nav .indicator {
          position: absolute;
          top: -50%;
          width: var(--item-size);
          height: var(--item-size);
          background: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          border: 6px solid var(--clr);
          transition: 0.5s;
        }

        .rm-bottom-nav .indicator .indicator-icon {
          color: #080000;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          z-index: 2;
        }

        .rm-bottom-nav .indicator .indicator-icon.icon-active {
          color: #3b82f6;
        }

        .rm-bottom-nav .indicator::before {
          content: '';
          position: absolute;
          top: 50%;
          left: -22px;
          width: 20px;
          height: 20px;
          border-top-right-radius: 20px;
          box-shadow: 0px -10px 0 0 var(--clr);
        }

        .rm-bottom-nav .indicator::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -22px;
          width: 20px;
          height: 20px;
          border-top-left-radius: 20px;
          box-shadow: 0px -10px 0 0 var(--clr);
        }

        .rm-bottom-nav .navigation ul li:nth-child(1).active ~ .indicator {
          transform: translateX(0px);
        }

        .rm-bottom-nav .navigation ul li:nth-child(2).active ~ .indicator {
          transform: translateX(calc(var(--item-size) + var(--item-gap)));
        }

        .rm-bottom-nav .navigation ul li:nth-child(3).active ~ .indicator {
          transform: translateX(calc((var(--item-size) + var(--item-gap)) * 2));
        }

        .rm-bottom-nav .navigation ul li:nth-child(4).active ~ .indicator {
          transform: translateX(calc((var(--item-size) + var(--item-gap)) * 3));
        }

        .rm-bottom-nav .navigation ul li:nth-child(5).active ~ .indicator {
          transform: translateX(calc((var(--item-size) + var(--item-gap)) * 4));
        }
      `}</style>

      <div className="navigation-shell">
        <div className="navigation">
          <ul>
            {navItems.map(({ label, Icon, path }, index) => (
              <li
                key={label}
                className={`list ${scannerIndex === index ? "active" : ""}`}
              >
                <Link
                  to={path}
                  className="nav-button"
                  onClick={() => setActiveIconIndex(index)}
                >
                  <span
                    className={`icon ${activeIconIndex === index ? "icon-active" : ""}`}
                  >
                    <Icon size={22} />
                  </span>
                  <span className="text">{label}</span>
                </Link>
              </li>
            ))}

            <div className="indicator">
              <span
                className={`indicator-icon ${
                  activeIconIndex === scannerIndex ? "icon-active" : ""
                }`}
              >
                <IndicatorIcon size={22} />
              </span>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}
