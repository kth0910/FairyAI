export const stories = [
    {
        id: 'jiang-taigong',
        title: '강태공의 뒤죽박죽 이야기',
        thumbnail: '/thumb1.png',
        scenes: [
            {
                id: 'scene-1',
                type: 'background',
                title: '장면 1: 배경 설명',
                originalText: '옛날 옛적 고대 중국에 낚시를 좋아하는 지혜로운 할아버지 강태공이 살았어요. 강태공은 바늘도 없는 낚싯대를 물에 담그고 세상을 구할 때를 기다리고 있었죠. 그런데 근처 동굴에는 심술궂은 요괴 구미호가 살며 사람들을 괴롭힐 궁리만 하고 있었답니다.',
                defaultImage: '/scene1.png',
                imagePrompt: 'Ancient China, wise old man Jiang Taigong fishing by the river with a straight needle, next to a cave with a mischievous Nine-tailed fox spirit peeking out, serene yet slightly ominous atmosphere, mythical vibes, highly detailed, digital painting style.'
            },
            {
                id: 'scene-2',
                type: 'gi',
                title: '장면 2: 기 (요괴의 방해)',
                defaultSubject: '심술궂은 구미호',
                defaultObject: '점잖은 강태공',
                defaultVerb: '방해했',
                defaultText: '심술궂은 구미호가 점잖은 강태공을 방해했어요.',
                defaultImage: '/scene2.png',
                verbOptions: [
                    { label: '방해했 (기본)', value: '방해했', type: 'default' },
                    { label: '간지럽혔 (장난)', value: '간지럽혔', type: 'mischief' },
                    { label: '칭찬했 (반어법)', value: '칭찬했', type: 'unexpected' }
                ],
                template: (s, o, v) => `${s}가 ${o}을 ${v}어요.`
            },
            {
                id: 'scene-3',
                type: 'seung',
                title: '장면 3: 승 (요괴의 마법과 위기)',
                defaultSubject: '화가 난 구미호',
                defaultObject: '뾰족한 가시 덩굴',
                defaultVerb: '소환했',
                defaultText: '화가 난 구미호가 뾰족한 가시 덩굴을 소환했어요.',
                defaultImage: '/scene3.png',
                verbOptions: [
                    { label: '소환했 (위기)', value: '소환했', type: 'default' },
                    { label: '덮쳤 (공격)', value: '덮쳤', type: 'attack' },
                    { label: '먹었 (배고픔)', value: '먹었', type: 'nonsense' }
                ],
                template: (s, o, v) => `${s}가 ${o}을 ${v}어요.`
            },
            {
                id: 'scene-4',
                type: 'jeon',
                title: '장면 4: 전 (강태공의 반격)',
                defaultSubject: '강태공',
                defaultObject: '눈부신 황금 낚싯대',
                defaultVerb: '휘둘렀',
                defaultText: '강태공이 눈부신 황금 낚싯대를 휘둘렀어요.',
                defaultImage: '/scene4.png',
                verbOptions: [
                    { label: '휘둘렀 (포획)', value: '휘둘렀', type: 'action' },
                    { label: '선물했 (평화)', value: '선물했', type: 'peace' },
                    { label: '맛보았 (반전)', value: '맛보았', type: 'unexpected' }
                ],
                template: (s, o, v) => `${s}이 ${o}를 ${v}어요.`
            },
            {
                id: 'scene-5',
                type: 'gyeol',
                title: '장면 5: 결 (마무리)',
                defaultSubject: '승리한 강태공',
                defaultObject: '푸른 강물',
                defaultVerb: '지켰',
                defaultText: '승리한 강태공이 푸른 강물을 지켰어요.',
                defaultImage: '/scene5.png',
                verbOptions: [
                    { label: '지켰 (해피)', value: '지켰', type: 'happy' },
                    { label: '헤엄쳤 (반전)', value: '헤엄쳤', type: 'unexpected' },
                    { label: '마셨 (목마름)', value: '마셨', type: 'nonsense' }
                ],
                template: (s, o, v) => `${s}이 ${o}을 ${v}어요.`
            }
        ]
    },
    {
        id: 'jocoding-robot-mess',
        title: '조코딩과 엉망진창 코딩 로봇',
        thumbnail: '/thumb2.png',
        scenes: [
            {
                id: 'scene-1',
                type: 'background',
                title: '장면 1: 배경 설명 (평화로운 창작)',
                originalText: '코딩나라의 천재 발명가 조코딩이 심심한 데이터들을 정리해 줄 \'만능 도우미 로봇\'을 만들고 있었어요. 마지막으로 코드를 입력하기만 하면 완성이었죠! 조코딩은 신이 나서 키보드 앞에 앉았답니다.',
                defaultImage: '/jocoding1.png',
            },
            {
                id: 'scene-2',
                type: 'gi',
                title: '장면 2: 기 (실수 발생!)',
                defaultSubject: '덜렁대는 조코딩',
                defaultObject: '엉뚱한 명령어',
                defaultVerb: '입력했',
                defaultText: '그런데, 덜렁대는 조코딩이 실수로 엉뚱한 명령어를 입력했어요!',
                defaultImage: '/jocoding2.png',
                verbOptions: [
                    { label: '입력했 (실수)', value: '입력했', type: 'default' },
                    { label: '쏟았 (커피)', value: '쏟았', type: 'mistake' },
                    { label: '가르쳤 (잘못된 교육)', value: '가르쳤', type: 'action' }
                ],
                template: (s, o, v) => `그런데, ${s}이 실수로 ${o}를 ${v}어요!`
            },
            {
                id: 'scene-3',
                type: 'seung',
                title: '장면 3: 승 (로봇의 오작동과 난장판)',
                defaultSubject: '오작동한 로봇',
                defaultObject: '주변의 데이터 블록',
                defaultVerb: '간지럽혔',
                defaultText: '그러자 오작동한 로봇이 주변의 데이터 블록들을 마구 간지럽히기 시작했어요.',
                defaultImage: '/jocoding3.png',
                verbOptions: [
                    { label: '간지럽혔 (장난)', value: '간지럽혔', type: 'mischief' },
                    { label: '먹어치웠 (폭주)', value: '먹어치웠', type: 'chaos' },
                    { label: '색칠했 (낙서)', value: '색칠했', type: 'creative_chaos' }
                ],
                template: (s, o, v) => `그러자 ${s}이 ${o}들을 마구 ${v}기 시작했어요.`
            },
            {
                id: 'scene-4',
                type: 'jeon',
                title: '장면 4: 전 (해결하려다 더 큰일!)',
                defaultSubject: '당황한 조코딩',
                defaultObject: '커다란 디버깅 망치',
                defaultVerb: '휘둘렀',
                defaultText: '당황한 조코딩이 로봇을 멈추려고 커다란 디버깅 망치를 휘둘렀어요.',
                defaultImage: '/jocoding4.png',
                verbOptions: [
                    { label: '휘둘렀 (액션)', value: '휘둘렀', type: 'action' },
                    { label: '던졌 (포기?)', value: '던졌', type: 'desperate' },
                    { label: '선물했 (회유)', value: '선물했', type: 'unexpected' }
                ],
                template: (s, o, v) => `${s}이 로봇을 멈추려고 ${o}를 ${v}어요.`
            },
            {
                id: 'scene-5',
                type: 'gyeol',
                title: '장면 5: 결 (코믹한 마무리)',
                defaultSubject: '코딩나라',
                defaultObject: '거대한 젤리 파티장',
                defaultVerb: '변했',
                defaultText: '결국 코딩나라는 거대한 젤리 파티장으로 변해버렸답니다. (모두가 즐거워했죠!)',
                defaultImage: '/jocoding5.png',
                verbOptions: [
                    { label: '변했 (결과)', value: '변했', type: 'default' },
                    { label: '초대했 (파티)', value: '초대했', type: 'happy_accident' },
                    { label: '가뒀 (새로운 문제?)', value: '가뒀', type: 'nonsense_end' }
                ],
                template: (s, o, v) => `결국 ${s}는 ${o}으로 ${v}답니다.`
            }
        ]
    }
];
