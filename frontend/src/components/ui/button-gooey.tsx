import { ArrowRightIcon } from "lucide-react";

export const ButtonGooey = ({ input }: { input: string }) => {
  return (
    <>
      <div className="wrapper">
        <div className="button">
          {input}
          <div className="bubble">
            <ArrowRightIcon className="h-8 w-8" />
          </div>
        </div>
      </div>

      <svg
        className="absolute hidden"
        width="0"
        height="0"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
      >
        <defs>
          <filter id="gooey">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      <style jsx>{`
        .wrapper {
          filter: url("#gooey");
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: start;
          align-items: center;
        }

        .button {
          background: #334155;
          color: #fff;
          display: inline-flex;
          font-weight: bold;
          padding: 0 10px 0 10px;
          border-radius: 6px;
          font-size: 1.25rem;
          line-height: 1.25rem;
          height: 48px;
          align-items: center;
        }

        .bubble {
          color: #fff;
          z-index: -10;
          display: flex;
          background: #334155;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 48px;
          position: absolute;
          transition: transform 0.6s;
          transition-timing-function: bezier(0.2, 0.8, 0.2, 0.8);
          transform: translateX(40%) translateY(0%);
        }

        .button:hover .bubble {
          transform: translateX(140%) translateY(0%);
        }
      `}</style>
    </>
  );
};
