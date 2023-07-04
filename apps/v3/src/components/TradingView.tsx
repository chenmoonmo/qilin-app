import styled from '@emotion/styled';
import useSize from '@react-hook/size';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { IChartApi, ISeriesApi } from 'lightweight-charts';
import { ColorType, createChart } from 'lightweight-charts';
import type { FC } from 'react';
import { useEffect, useLayoutEffect, useRef } from 'react';

dayjs.extend(utc);

type TradingViewProps = {
  data?: any[];
};

const ChartContainer = styled.div`
  position: relative;
  z-index: 0;
  /* border: 1px solid #363a45; */
`;

export const TradingView: FC<TradingViewProps> = ({ data }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const chart = useRef<IChartApi>();
  const series = useRef<ISeriesApi<'Candlestick'>>();

  const [clientWidth, clientHeight] = useSize(chartRef);

  useEffect(() => {
    if (clientWidth && clientHeight) {
      chart.current?.resize(clientWidth, clientHeight);
    }
  }, [clientWidth, clientHeight]);

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
        tickMarkFormatter: (unixTime: number) => {
          return dayjs.unix(unixTime).utc().format('MM/DD h:mm A');
        },
      },
      rightPriceScale: {
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

    series.current = chart.current?.addCandlestickSeries({
      upColor: '#44C27F',
      downColor: '#E15C48',
      wickUpColor: '#44C27F',
      wickDownColor: '#E15C48',
      borderVisible: true,
    });

    return () => {
      chart.current?.remove?.();
    };
  }, []);

  useEffect(() => {
    series.current?.setData?.(data ?? []);
  }, [data]);

  return <ChartContainer ref={chartRef} />;
};
