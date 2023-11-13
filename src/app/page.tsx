'use client';
import Navigation from '@/components/Navigation';
import { useRouter } from 'next/navigation';
import { refreshToken } from '@/lib/token';

export default function Home() {
    const accessToken = sessionStorage.getItem('accessToken');

    if (accessToken) {
        // const CreateChat = async () => {
        //     const response = await fetch('https://fastcampus-chat.net/chat', {
        //         method: 'POST',
        //         body: JSON.stringify({
        //             name: '9조 단톡방',
        //             users: ['test01', 'test02', 'test03', 'test04', 'test05'],
        //             isPrivate: false,
        //         }),
        //         headers: {
        //             'content-type': 'application/json',
        //             serverId: '53b9f98a',
        //             Authorization:
        //                 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUzYjlmOThhOnRlc3QwMSIsImlhdCI6MTY5OTQ2NDg5MiwiZXhwIjoxNzAwMDY5NjkyfQ.6QdnpwqNP7X-wF0e2CspB1kx0oNLowa4NARDgiU9wXs',
        //         },
        //     });
        //     const data = await response.json();
        //     console.log(data);
        // };

        // const accessToken = sessionStorage.getItem('accessToken');

        // const LeaveChat = async () => {
        //      const response = await fetch('https://fastcampus-chat.net/chat/leave', {
        //          method: 'PATCH',
        //          body: JSON.stringify({
        //              chatId: 'be5ed6ab-7007-4c5c-b768-46f241741ef4',
        //          }),
        //          headers: {
        //              'content-type': 'application/json',
        //              Authorization: `Bearer ${accessToken}`,
        //              serverId: `${process.env.NEXT_PUBLIC_SERVER_KEY}`,
        //          },
        //      });
        //      const data = await response.json();
        //      console.log(data);
        //  };

        const router = useRouter();

        const onLogout = () => {
            sessionStorage.removeItem('accessToken');
            sessionStorage.removeItem('refreshToken');
            sessionStorage.removeItem('userId');
            sessionStorage.removeItem('expiresAt');

            router.push('/login');
        };

        return (
            <main
                style={{
                    height: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '100px',
                }}
            >
                <br></br>
                <div>
                    <p>test01, 12345, 정민</p>
                    <p>test02, 12345, 현진</p>
                    <p>test03, 12345, 욱진</p>
                    <p>test04, 12345, 지오</p>
                    <p>test05, 12345, 종수</p>
                </div>

                <a href="/chating/79fa7366-807e-4cdc-9c91-b02331889c89">9조 단톡방</a>
                <Navigation></Navigation>

                <div>
                    <button
                        onClick={onLogout}
                        style={{
                            margin: '30px 0',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '10px',
                            background: ' #00956e',
                            color: '#eee',
                        }}
                    >
                        임시 로그아웃
                    </button>
                </div>
                <ul style={{ fontSize: '0.85rem', opacity: '0.75' }}>
                    <li style={{ paddingBottom: '0.3rem' }}>
                        로그아웃 버튼 클릭 - 로그인 페이지 이동(세션스토리지 : userId, accessToken 삭제 처리)
                    </li>
                    <li style={{ paddingBottom: '0.3rem' }}>
                        accessToken X - 로그인, 회원가입 페이지만 접근 가능합니다.
                    </li>
                    <li>accessToken O - 로그인, 회원가입 페이지접근 불가합니다.</li>
                </ul>
                <div>
                    <button
                        onClick={refreshToken}
                        style={{
                            margin: '30px 0',
                            border: 'none',
                            borderRadius: '5px',
                            padding: '10px',
                            background: ' #00956e',
                            color: '#eee',
                        }}
                    >
                        로그인 연장
                    </button>
                </div>
            </main>
        );
    } else {
        return null;
    }
}
