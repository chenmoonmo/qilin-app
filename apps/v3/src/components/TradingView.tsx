import styled from '@emotion/styled';
import { useMutationObserver } from '@qilin/hooks';
import type { IChartApi } from 'lightweight-charts';
import { ColorType, createChart } from 'lightweight-charts';
import { useLayoutEffect, useRef } from 'react';

const ChartContainer = styled.div`
  position: relative;
  z-index: 0;
  border: 1px solid #363a45;
`;

export const TradingView = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  const chart = useRef<IChartApi>();

  useLayoutEffect(() => {
    const width = chartRef.current?.clientWidth;
    const height = chartRef.current?.clientHeight;
    chart.current = createChart(chartRef.current!, {
      width,
      height,
      timeScale: {
        timeVisible: true,
        borderColor: '#363A45',
        barSpacing: 15,
        secondsVisible: false,
        lockVisibleTimeRangeOnResize: true,
        // tickMarkFormatter: (unixTime: number) => {
        //   return dayjs.unix(unixTime).utc().format('MM/DD h:mm A');
        // },
      },
      rightPriceScale: {
        borderColor: '#363A45',
      },
      leftPriceScale: {
        visible: true,
        borderColor: '#363A45',
      },
      layout: {
        background: { type: ColorType.Solid, color: '#1F2127' },
        textColor: '#9094a2',
        fontSize: 12,
        fontFamily: 'InterVariable',
      },
      grid: {
        horzLines: {
          color: '#363A45',
        },
        vertLines: {
          color: '#363A45',
        },
      },
    });

    return () => {
      chart.current?.remove?.();
    };
  }, []);

  // useMutationObserver(chartRef, () => {
  //   console.log(111, chartRef);
  //   const width = chartRef.current?.clientWidth;
  //   const height = chartRef.current?.clientHeight;
  //   if (width && height) {
  //     chart.current?.resize(width, height);
  //   }
  // });

  return <ChartContainer ref={chartRef} />;
};
