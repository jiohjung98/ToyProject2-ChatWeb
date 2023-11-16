'use client';

import styled from 'styled-components';
import StyledComponentsRegistry from '../lib/registry';
import { ThemeProvider } from 'styled-components';
import theme from '@/style/theme';
import { RecoilRoot } from 'recoil';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { authCheck } from '@/hooks/AuthCheck';
import Move from '@/components/Move';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getCookie } from '@/lib/cookie';
import Head from './head';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const [shouldRenderMoveComponent, setShouldRenderMoveComponent] = useState<boolean>(false);

  authCheck(setShouldRenderMoveComponent);

  /** 접속 유저 검색 */
  const accessToken = getCookie('accessToken');

  const socket = io(`https://fastcampus-chat.net/server`, {
    extraHeaders: {
      Authorization: `Bearer ${accessToken}`,
      serverId: `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
    },
  });

  useEffect(() => {
    socket.emit('users-server');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <html lang="en">
          <StyledComponentsRegistry>
            <ThemeProvider theme={theme}>
              <Head />
              <Body>
                <Container>
                  {shouldRenderMoveComponent && <Move />}
                  {children}
                </Container>
                <ReactQueryDevtools />
              </Body>
            </ThemeProvider>
          </StyledComponentsRegistry>
        </html>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

const Body = styled.body`
  margin: 0;
  width: 100vw;
  height: 100vh;
  background-color: #efefef;
  * {
    box-sizing: border-box;
  }

  @font-face {
    font-family: 'NotoSans';
    src: url('/fonts/NotoSansKR-Medium.ttf');
  }

  font-family: 'NotoSans';
`;

const Container = styled.div`
  width: 100%;
  max-width: 800px;
  height: 100%;
  overflow: hidden;

  margin: 0 auto;
  position: relative;

  background-color: #fff;
`;
