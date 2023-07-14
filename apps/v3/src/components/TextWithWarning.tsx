import { css } from '@emotion/react';
import { Tooltip } from '@qilin/component';

type TextWithWarningProps = {
  children: React.ReactNode;
  text?: React.ReactNode;
  isWarning?: boolean;
};

export const TextWithWarning: React.FC<TextWithWarningProps> = ({
  children,
  text,
  isWarning,
}) => {
  if (isWarning) {
    return (
      <div
        css={css`
          display: flex;
          align-items: center;
          color: #e15c48;
          svg {
            cursor: pointer;
            margin-left: 4px;
          }
        `}
      >
        {children}
        <Tooltip text={text}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_167_10"
              //   style="mask-type:luminance"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="12"
              height="12"
            >
              <path d="M12.0002 0H0.00195312V12H12.0002V0Z" fill="white" />
            </mask>
            <g mask="url(#mask0_167_10)">
              <path
                d="M5.99444 0.00762939C2.68374 0.00762939 0 2.68888 0 5.99652C0 9.304 2.68374 11.9854 5.99444 11.9854C9.30499 11.9854 11.9889 9.30415 11.9889 5.99652C11.9889 2.68888 9.30514 0.00762939 5.99444 0.00762939ZM6.50958 3.00207V6.97307C6.50958 7.25731 6.27894 7.48774 5.99444 7.48774C5.70994 7.48774 5.47929 7.25731 5.47929 6.97307V3.00207C5.47929 2.71784 5.70994 2.4874 5.99444 2.4874C6.27894 2.4874 6.50958 2.71784 6.50958 3.00207ZM5.99444 8.00841C6.40817 8.00841 6.74374 8.34368 6.74374 8.75702C6.74374 9.17051 6.40817 9.50563 5.99444 9.50563C5.58056 9.50563 5.24513 9.17036 5.24513 8.75702C5.24513 8.34368 5.58056 8.00841 5.99444 8.00841Z"
                fill="#E15C48"
              />
            </g>
          </svg>
        </Tooltip>
      </div>
    );
  }
  return <>{children}</>;
};
