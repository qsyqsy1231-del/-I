// 1. 실제 주소, 위경도 좌표가 완전 매핑된 12개 데이터셋 (11번 삭제 상태 유지)
const defaultMockData = {
    1: { 
        title: "청파동 골목 식당 공실", 
        location: "서울특별시 용산구 청파로47나길 11", 
        rent: "보증금/월세", 
        floor: "1층", 
        area: "중형 (20~30평 내외 / 일반 식당, 의류 매장 크기)", 
        industry: "식음료/음식점 (일반 식당, 주점, 패스트푸드 등)", 
        period: "6개월 이상(장기 방치)", 
        lat: 37.5457, 
        lng: 126.9678, 
        context: "한때 지역 보행자들의 정겨운 식사를 책임지던 찌개 전문 동네식당이었습니다. 골목 상권의 이탈과 프랜차이즈 유입으로 폐업한 지 약 8개월째로, 옛 유리창 시트지와 흙 묻은 빗자루만 쓸쓸히 입구를 지키고 있습니다." 
    },
    2: { 
        title: "숙대 앞 메인거리 필라테스 공실", 
        location: "서울특별시 용산구 청파로47길 78-18", 
        rent: "보증금/월세", 
        floor: "1층", 
        area: "중형 (20~30평 내외 / 일반 식당, 의류 매장 크기)", 
        industry: "뷰티/생활 서비스 (미용실, 네일샵, 필라테스, 인생네컷 등)", 
        period: "6개월 이상(장기 방치)", 
        lat: 37.5445, 
        lng: 126.9660, 
        context: "숙대 앞 대학 상권의 주축을 담당하던 여성 전용 필라테스/뷰티 센터 자리입니다. 코로나19 이후 유동인구 패턴의 근본적 전환과 높은 고정 임대료를 이기지 못해 퇴거하였으며, 현재는 내부 목조 뼈대와 일부 락커룸 거울 흔적만 노출된 거대한 공백입니다." 
    },
    3: { 
        title: "청파동 1가 문닫은 공실", 
        location: "서울특별시 용산구 청파로 333-1", 
        rent: "알수없음", 
        floor: "1층", 
        area: "소형 (10평 내외 / 일반 카페, 테이크아웃 크기)", 
        industry: "식음료/음식점 (일반 식당, 주점, 패스트푸드 등)", 
        period: "3개월 미만(최근 공실)", 
        lat: 37.5489, 
        lng: 126.9692, 
        context: "최근까지 1인 가구를 타깃으로 한 무인 밀키트/반찬 숍이 운영되던 소형 상가입니다. 무인 트렌드의 포화와 마진 악화로 단기 운영 후 급히 철수하였으며, 내부 설비는 아직 철거되지 않은 채 임시 방치되어 있습니다." 
    },
    4: { 
        title: "청파로 321 공실", 
        location: "서울특별시 용산구 청파로 321", 
        rent: "알수없음", 
        floor: "1층", 
        area: "소형 (10평 내외 / 일반 카페, 테이크아웃 크기)", 
        industry: "오피스/기타 (학원, 공유 오피스, 일반 사무실 등)", 
        period: "3~6개월(일반)", 
        lat: 37.5478, 
        lng: 126.9691, 
        context: "작은 보습학원 상담실 및 대기 공간으로 활용되던 자리입니다. 청파로 도로변 소음에 취약하고 비정형적인 필지 형태 구조를 가지고 있어 사무 공간으로의 재진입 장벽이 높아 임차인 모집에 어려움을 겪는 곳입니다." 
    },
    5: { 
        title: "청파로 301-1", 
        location: "서울특별시 용산구 청파로 301-1", 
        rent: "보증금/월세", 
        floor: "1층", 
        area: "중형 (20~30평 내외 / 일반 식당, 의류 매장 크기)", 
        industry: "식음료/음식점 (일반 식당, 주점, 패스트푸드 등)", 
        period: "6개월 이상(장기 방치)", 
        lat: 37.5463, 
        lng: 126.9693, 
        context: "전통 한식 백반 전문 식당이었던 공실입니다. 청파동 골목 식당 구역 인근에 입지해 있었으나 골목 활성화 흐름의 둔화와 고령 건물주와의 조건 불합치로 계약 만료 후 공실이 장기화되고 있습니다." 
    },
    6: { 
        title: "청파로 295-1", 
        location: "서울특별시 용산구 청파로 295-1", 
        rent: "보증금/월세", 
        floor: "1층", 
        area: "중형 (20~30평 내외 / 일반 식당, 의류 매장 크기)", 
        industry: "식음료/음식점 (일반 식당, 주점, 패스트푸드 등)", 
        period: "6개월 이상(장기 방치)", 
        lat: 37.5455, 
        lng: 126.9698, 
        context: "대형 호프/주점으로 오랫동안 운영되어 청파동 주민들의 모임 공간이 되었던 상가입니다. 상가 건물의 안전 진단 등 이슈와 맞물려 폐업한 이후 내부 집기 철거조차 멈춘 상태로 먼지가 수북이 내려앉아 있습니다." 
    },
    7: { 
        title: "청파로85길 31", 
        location: "서울특별시 용산구 청파로85길 31", 
        rent: "보증금/월세", 
        floor: "1층", 
        area: "중형 (20~30평 내외 / 일반 식당, 의류 매장 크기)", 
        industry: "기타", 
        period: "3~6개월(일반)", 
        lat: 37.5501, 
        lng: 126.9672, 
        context: "소규모 생활물류 유통 보관소 겸 퀵서비스 대기소로 사용되던 필지입니다. 물류 거점의 외곽 이전과 상업 코드 변환으로 폐쇄되었으며, 골목 안쪽에 위치하여 일반 소비재 매장으로의 전환이 더딥니다." 
    },
    8: { 
        title: "청파로 335-5", 
        location: "서울특별시 용산구 청파로 335-5", 
        rent: "전세", 
        floor: "1층", 
        area: "소형 (10평 내외 / 일반 카페, 테이크아웃 크기)", 
        industry: "기타", 
        period: "6개월 이상(장기 방치)", 
        lat: 37.5492, 
        lng: 126.9688, 
        context: "오래된 인쇄 작업실 겸 철물 잡화 판매소였습니다. 청파동 일대 주거 환경 정비 추진과 노후 장비 폐기로 인해 주인이 퇴거한 이후, 용도 변형 없이 빈 공간으로 남아 도시 시간의 단절을 시각화합니다." 
    },
    9: { 
        title: "당산로 47길 7", 
        location: "서울특별시 영등포구 당산로47길 7", 
        rent: "알수없음", 
        floor: "1층", 
        area: "대형 (50평 이상 / 프랜차이즈, 마트 크기)", 
        industry: "식음료/음식점 (일반 식당, 주점, 패스트푸드 등)", 
        period: "6개월 이상(장기 방치)", 
        lat: 37.5375, 
        lng: 126.9031, 
        context: "당산역 역세권 초입에 위치했던 유명 프랜차이즈 대형 한식 뷔페 자리입니다. 1층 전체 면적이 70평이 넘는 대규모 점포로, 지나치게 무거운 월세와 관리 조건으로 인해 퇴거 후 새로운 임차인을 찾지 못한 채 10개월 이상 방치되어 있습니다." 
    },
    10: { 
        title: "당산로16길 11", 
        location: "서울 영등포구 당산로16길 11", 
        rent: "보증금/월세", 
        floor: "1층", 
        area: "중형 (20~30평 내외 / 일반 식당, 의류 매장 크기)", 
        industry: "패션/잡화 (의류, 소품샵, 악세사리 등)", 
        period: "3~6개월(일반)", 
        lat: 37.5273, 
        lng: 126.8964, 
        context: "당산동 이면 주거지 골목 초입의 의류 셀렉트숍이자 잡화 소품매장이었습니다. 비대면 커머스 강화의 여파로 매출이 하락하며 폐점하였으며, 아기자기하던 조명 데코 흔적만 쇼윈도 위에 스티커 자국으로 남아 있습니다." 
    },
    // 11번 삭제 유지
    12: { 
        title: "당산로28길 18-1", 
        location: "서울특별시 영등포구 당산로28길 18-1", 
        rent: "보증금/월세", 
        floor: "1층", 
        area: "중형 (20~30평 내외 / 일반 식당, 의류 매장 크기)", 
        industry: "식음료/음식점 (일반 식당, 주점, 패스트푸드 등)", 
        period: "6개월 이상(장기 방치)", 
        lat: 37.5285, 
        lng: 126.8971, 
        context: "골목 상권 이면의 작은 이자카야/퓨전 선술집이었습니다. 재료비 인상과 인건비 충격을 감당하지 못하고 임대차 계약이 해지되었으며, 내부 바 테이블 흔적 및 깨진 도자기 그릇 몇 점이 선반에 남겨져 있습니다." 
    },
    13: { 
        title: "당산로36길 3-3", 
        location: "서울 영등포구 당산로36길 3-3", 
        rent: "보증금/월세", 
        floor: "1층", 
        area: "소형 (10평 내외 / 일반 카페, 테이크아웃 크기)", 
        industry: "식음료/음식점 (일반 식당, 주점, 패스트푸드 등)", 
        period: "3~6개월(일반)", 
        lat: 37.5320, 
        lng: 126.9025, 
        context: "소형 수제 마카롱과 베이커리를 판매하던 1인 숍 테이크아웃 전용 공간이었습니다. 당산역 유동 인구 동선에서 다소 빗겨나간 위치로 인해 권리금 없는 매물로 부동산에 올라와 있는 쓸쓸한 쇼윈도입니다." 
    }
};

// 2. 고해상도 예술 공실 에셋 매퍼 (11번 삭제 반영 및 당산동 3대 실사 이미지 archive_10, 12, 13 지정 유지)
function getImgPath(id) {
    const assetMapping = {
        1: "assets/archive_1.jpg",
        2: "assets/archive_3.jpg",
        3: "assets/archive_9.jpg",
        4: "assets/archive_4.jpg",
        5: "assets/archive_5.jpg",
        6: "assets/archive_6.jpg",
        7: "assets/archive_7.jpg",
        8: "assets/archive_8.jpg",
        9: "assets/archive_2.jpg",
        10: "assets/archive_10.jpg", 
        12: "assets/archive_12.jpg", 
        13: "assets/archive_13.jpg"  
    };
    return assetMapping[id] || "https://picsum.photos/400/300?random=" + id;
}

// 3. 전역 상태 변수
let mockData = {};
let activeChart = null;

// Leaflet 지도 인스턴스 및 마커 레퍼런스 딕셔너리
let map = null;
let markers = {};

// 제보 핀배치(Placement Mode) 변수
let isPlacementMode = false;
let pendingReportData = null;
const placementOverlay = document.getElementById('mapPlacementOverlay');
const placementBanner = document.getElementById('mapPlacementBanner');

// 4. 로컬 스토리지 동기화 및 초기 로드
function initApp() {
    const savedData = localStorage.getItem('blankMapData');
    if (savedData) {
        mockData = JSON.parse(savedData);
        
        // [강제 정합 자가치유 복원] 위경도 누락 구버전 스토리지 데이터 자동 감지 및 덮어쓰기 복구
        let needsReset = false;
        Object.keys(mockData).forEach(key => {
            if (!mockData[key].lat || !mockData[key].lng) {
                needsReset = true;
            }
        });
        
        if (needsReset) {
            mockData = { ...defaultMockData };
            localStorage.setItem('blankMapData', JSON.stringify(mockData));
        }
        
        // 로컬 스토리지 데이터 내 11번('당산로23길 6 상가') 제거 동기화 보증
        if (mockData[11]) {
            delete mockData[11];
            localStorage.setItem('blankMapData', JSON.stringify(mockData));
        }
    } else {
        mockData = { ...defaultMockData };
        localStorage.setItem('blankMapData', JSON.stringify(mockData));
    }
    
    // 4-1. 라이브 지도 (Leaflet.js 오픈스트리트맵 엔진) 구동
    initLeafletMap();
    
    // 4-2. 프리 아카이브 보드 폴라로이드 렌더링
    renderFreeBoard();
}

// 5. Leaflet 라이브 오픈스트리트맵 초기화 및 마커 렌더링
function initLeafletMap() {
    // 청파동과 당산동 상권을 아우르는 위치에 중심 셋뷰 지정 (줌 13배)
    map = L.map('map', {
        zoomControl: true,
        attributionControl: false
    }).setView([37.542, 126.935], 13);

    // 진짜 오픈스트리트맵 타일 연동 (상세 세부 도로 및 지명 실시간 갱신)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // 맵 줌인/아웃 HUD 동기화 연동
    map.on('zoomend', () => {
        // 기준 줌 13을 100%로 환산하여 줌 퍼센트 HUD 업데이트
        const zoomPercent = Math.round((map.getZoom() / 13) * 100);
        document.getElementById('hudZoomPercent').innerText = `${zoomPercent}%`;
    });

    // 12개 실사 마커 생성
    renderLeafletMarkers();

    // 제보 모드 시 지도 클릭 핸들링
    map.on('click', (e) => {
        if (!isPlacementMode || !pendingReportData) return;
        placeReportPin(e.latlng.lat, e.latlng.lng);
    });
}

// 지도 위 마커 렌더링 엔진
function renderLeafletMarkers() {
    // 기존 마커 삭제
    Object.values(markers).forEach(m => map.removeLayer(m));
    markers = {};

    Object.keys(mockData).forEach(idKey => {
        const id = parseInt(idKey);
        const item = mockData[id];
        if (!item.lat || !item.lng) return;

        // 고유 백색-연두 커스텀 원형 핀 디자인 적용 (튕김 완전 방지 앵커)
        const customIcon = L.divIcon({
            className: 'custom-leaflet-marker',
            iconSize: [20, 20],
            iconAnchor: [10, 10],
            html: `
                <div class="marker-circle-wrapper" id="leaflet-marker-node-${id}">
                    <div class="marker-circle-inner"></div>
                </div>
            `
        });

        const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map);

        // 마커 클릭 ➔ Fly-To 및 상세 바인딩
        marker.on('click', () => {
            focusMapMarker(id);
        });

        markers[id] = marker;
    });
}

// 클릭된 마커 하이라이팅 효과
function highlightMarker(activeId) {
    Object.keys(markers).forEach(idKey => {
        const id = parseInt(idKey);
        const markerElement = markers[id].getElement();
        if (markerElement) {
            if (id === activeId) {
                markerElement.classList.add('selected');
            } else {
                markerElement.classList.remove('selected');
            }
        }
    });
}

// 6. 아카이브 보드 엇박자 포스터 콜라주 그리드(Asymmetric Masonry Grid) 렌더링 엔진
function renderFreeBoard() {
    const gridContainer = document.getElementById('freeArchiveGrid');
    if (!gridContainer) return;
    
    gridContainer.innerHTML = '';
    
    const totalItems = Object.keys(mockData).length;
    document.getElementById('archiveBoardTitle').innerText = `Archive Free Board (${totalItems})`;
    
    // 4개의 세로 컬럼 객체 동적 형성
    const columns = [];
    for (let i = 0; i < 4; i++) {
        const col = document.createElement('div');
        col.className = 'collage-column';
        gridContainer.appendChild(col);
        columns.push(col);
    }
    
    Object.keys(mockData).forEach((idKey, index) => {
        const id = parseInt(idKey);
        const item = mockData[id];
        const card = document.createElement('div');
        card.className = 'free-card';
        
        let imgPath = item.userUploadedImg || getImgPath(id);
        
        // 엇박자 포스터 느낌의 겹침 없는 무작위 회전각 및 높낮이 계산식
        const randomRotate = (Math.random() * 8) - 4; // -4도 ~ +4도 사이의 세련된 무작위 회전
        // 비대칭 이미지 박스 높이 할당 (120px ~ 175px 사이 순차 배분으로 매거진 같은 입체적 그리드 생성)
        const imgHeight = [120, 160, 135, 175][index % 4];
        // 개별적인 엇박자 상하 여백 설정
        const marginTop = (index * 12) % 35;
        
        card.style.transform = `rotate(${randomRotate}deg)`;
        card.style.marginTop = `${marginTop}px`;
        
        card.innerHTML = `
            <div class="img-box" style="height: ${imgHeight}px;">
                <img src="${imgPath}" alt="${item.title}" onerror="this.src='https://picsum.photos/300/200?random=${id}'">
            </div>
            <div class="card-title">${item.title}</div>
            <div class="card-meta">${item.location.split(' ')[2] || '서울 구역'}</div>
        `;
        
        card.onclick = () => {
            focusMapMarker(id);
        };
        
        // 카드를 4개 컬럼에 순차 배분 (절대 서로 겹치지 않음!)
        columns[index % 4].appendChild(card);
    });
}

// 스크롤 다운 가이드 클릭 시 아카이브 보드로 부드럽게 스크롤
function scrollToArchive() {
    const archiveSec = document.getElementById('archiveSection');
    if (archiveSec) {
        archiveSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// 7. 네비게이션 탭 전환 (page-home <-> page-work)
function switchPage(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    const targetPage = document.getElementById(`page-${pageName}`);
    const targetNavItem = document.getElementById(`nav-${pageName}`);
    
    if (targetPage && targetNavItem) {
        targetPage.classList.add('active');
        targetNavItem.classList.add('active');
    }
}

// 8. 제보하기 팝업 모달 가시화
function toggleModal(show) {
    const overlay = document.getElementById('modalOverlay');
    if (show) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    } else {
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function closeModalOutside(e) {
    if (e.target === document.getElementById('modalOverlay')) {
        toggleModal(false);
    }
}

// 이미지 파일 첨부 미리보기 및 base64 파싱
let base64Image = null;
function handleFileChange(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('fileUploadPreview');
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            base64Image = e.target.result;
            preview.innerHTML = `<img src="${base64Image}" alt="업로드 이미지 미리보기">`;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
        preview.innerHTML = '';
        base64Image = null;
    }
}

// 9. 제보 폼 제출 ➔ '핀 배치 모드(Placement Mode)' 진입 인터랙션
function handleFormSubmit(e) {
    e.preventDefault();
    
    pendingReportData = {
        title: document.getElementById('reportName').value,
        location: document.getElementById('reportLocation').value,
        rent: document.getElementById('reportRent').value,
        floor: document.getElementById('reportFloor').value,
        area: document.getElementById('reportArea').value,
        industry: document.getElementById('reportIndustry').value,
        period: document.getElementById('reportPeriod').value,
        userUploadedImg: base64Image,
        context: "시민이 자발적으로 목격하고 제보한 로컬 공백 포인트입니다. 실사단 2차 정밀 실사가 대기중이며, 지역 활성 코드가 소실되어 정체된 상태입니다."
    };
    
    toggleModal(false);
    activatePlacementMode();
}

function activatePlacementMode() {
    isPlacementMode = true;
    
    placementOverlay.classList.add('active');
    placementBanner.classList.add('active');
    
    switchPage('home');
    showToastNotification("지도 상에 공실이 있는 실제 건물 지점을 클릭하여 핀을 꽂으세요.", "fa-solid fa-map-pin");
}

// 실제 지도 클릭 시 핀 드롭
function placeReportPin(lat, lng) {
    if (!isPlacementMode || !pendingReportData) return;

    const newId = Object.keys(mockData).length + 1;
    
    pendingReportData.lat = lat;
    pendingReportData.lng = lng;
    
    mockData[newId] = pendingReportData;
    localStorage.setItem('blankMapData', JSON.stringify(mockData));
    
    // 원형 핀 형태의 마커 생성 및 클릭 바인딩 (튕김 완전 방지 앵커)
    const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        html: `
            <div class="marker-circle-wrapper" id="leaflet-marker-node-${newId}">
                <div class="marker-circle-inner"></div>
            </div>
        `
    });

    const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    marker.on('click', () => {
        focusMapMarker(newId);
    });

    markers[newId] = marker;
    
    renderFreeBoard();
    deactivatePlacementMode();
    
    focusMapMarker(newId);
    showToastNotification("시민 제보가 실시간 오픈스트리트맵 핀과 폴라로이드 보드에 즉시 통합되었습니다!", "fa-solid fa-circle-check");
    
    const form = document.querySelector('form');
    if (form) form.reset();
    document.getElementById('fileUploadPreview').style.display = 'none';
    base64Image = null;
}

function deactivatePlacementMode() {
    isPlacementMode = false;
    pendingReportData = null;
    
    placementOverlay.classList.remove('active');
    placementBanner.classList.remove('active');
}

// 10. 아카이브 카드 클릭 시 Fly-To 비행 모션
function focusMapMarker(markerId) {
    const data = mockData[markerId];
    if (!data || !data.lat || !data.lng) return;
    
    // Leaflet.js flyTo를 이용해 부드러운 위치 비행 스무스 연동
    map.flyTo([data.lat, data.lng], 16, {
        animate: true,
        duration: 1.4
    });
    
    setTimeout(() => {
        showData(markerId);
        highlightMarker(markerId);
    }, 600);
}

// 11. 마커 클릭 ➔ 글래스 패널 스펙 로드 & 실사 이미지 프리뷰 바인딩 & Chart.js 막대 차트 드로잉
function showData(markerId) {
    document.getElementById('dataPlaceholder').style.display = 'none';
    const content = document.getElementById('dataDynamicContent');
    content.style.display = 'block';

    const data = mockData[markerId];
    
    const panelImg = document.getElementById('panelImg');
    if (panelImg) {
        panelImg.src = data.userUploadedImg || getImgPath(markerId);
        panelImg.onerror = function() { 
            this.src = `https://picsum.photos/400/300?random=${markerId}`; 
        };
    }

    document.getElementById('panelTitle').innerText = data.title;
    document.getElementById('panelLocation').innerText = data.location;
    // GPS 위경도 표기
    document.getElementById('panelCoords').innerText = `GPS ${data.lat.toFixed(5)}, ${data.lng.toFixed(5)}`;

    // 1. 임대 형태 인포그래픽 바인딩
    const rentVal = data.rent;
    const rentBadges = document.querySelectorAll('#infoRent .rent-badge');
    rentBadges.forEach(b => {
        if (b.getAttribute('data-rent') === rentVal) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });

    // 2. 층수 구분 인포그래픽 바인딩 (빌딩 모형)
    const floorVal = data.floor;
    const floorLayers = document.querySelectorAll('#infoFloor .floor-layer');
    floorLayers.forEach(l => {
        if (l.getAttribute('data-floor') === floorVal) {
            l.classList.add('active');
        } else {
            l.classList.remove('active');
        }
    });

    // 3. 면적 규모 인포그래픽 바인딩 (비대칭 기하 사각형)
    const areaVal = data.area;
    let sizeCategory = "소형";
    if (areaVal.includes("대형") || areaVal.includes("50평")) {
        sizeCategory = "대형";
    } else if (areaVal.includes("중형") || areaVal.includes("20~30평")) {
        sizeCategory = "중형";
    } else if (areaVal.includes("소형") || areaVal.includes("10평")) {
        sizeCategory = "소형";
    }
    const areaBoxes = document.querySelectorAll('#infoArea .area-box-wrap');
    areaBoxes.forEach(box => {
        if (box.getAttribute('data-area') === sizeCategory) {
            box.classList.add('active');
        } else {
            box.classList.remove('active');
        }
    });

    // 4. 이전 업종 인포그래픽 바인딩 (원형 그리드)
    const indVal = data.industry;
    let indCategory = "기타";
    if (indVal.includes("카페") || indVal.includes("디저트")) {
        indCategory = "카페";
    } else if (indVal.includes("식음료") || indVal.includes("음식점")) {
        indCategory = "식음료";
    } else if (indVal.includes("패션") || indVal.includes("잡화")) {
        indCategory = "패션";
    } else if (indVal.includes("뷰티") || indVal.includes("생활")) {
        indCategory = "뷰티";
    } else if (indVal.includes("오피스") || indVal.includes("학원") || (indVal.includes("기타") && indVal.includes("오피스"))) {
        indCategory = "오피스";
    } else {
        indCategory = "기타";
    }
    const indItems = document.querySelectorAll('#infoIndustry .industry-item');
    indItems.forEach(item => {
        if (item.getAttribute('data-industry') === indCategory) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // 5. 공실 기간 인포그래픽 바인딩 (타임라인 위험도 노드)
    const periodVal = data.period;
    let periodCat = "일반";
    if (periodVal.includes("3개월 미만")) {
        periodCat = "최근";
    } else if (periodVal.includes("6개월 이상")) {
        periodCat = "장기";
    } else {
        periodCat = "일반";
    }
    const periodNodes = document.querySelectorAll('#infoPeriod .period-node');
    periodNodes.forEach(node => {
        if (node.getAttribute('data-period') === periodCat) {
            node.classList.add('active');
        } else {
            node.classList.remove('active');
        }
    });

    // Chart.js 막대형(bar) 차트 드로잉
    const ctx = document.getElementById('hierarchicalChart').getContext('2d');
    if (activeChart) { 
        activeChart.destroy(); 
    }

    // 공간 면적 텍스트 기반 위계 스케일 정량화
    let areaScore = 45;
    if (data.area.includes("대형") || data.area.includes("50평")) {
        areaScore = 95;
    } else if (data.area.includes("중형") || data.area.includes("20~30평")) {
        areaScore = 65;
    } else if (data.area.includes("소형") || data.area.includes("10평")) {
        areaScore = 30;
    }
    
    // 공실 기간 기반 가치 소실 위계 산정
    let scorePeriod = 50;
    if (data.period.includes("6개월")) {
        scorePeriod = 92;
    } else if (data.period.includes("3~6")) {
        scorePeriod = 55;
    } else if (data.period.includes("3개월")) {
        scorePeriod = 20;
    }
    
    // 모든 폰트에 Pretendard 적용 강제 지정
    Chart.defaults.font.family = 'Pretendard';
    
    activeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['공실 장기화율', '공간 면적 위계', '상권 이탈도'],
            datasets: [{
                data: [scorePeriod, areaScore, Math.round((scorePeriod + areaScore) / 2)],
                backgroundColor: ['#FFA57D', '#FFB898', '#FFCBB3'],
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1C2317',
                    titleFont: { size: 11, family: 'Pretendard', weight: '700' },
                    bodyFont: { size: 11, family: 'Pretendard' },
                    displayColors: false,
                    padding: 10
                }
            },
            scales: {
                y: { 
                    beginAtZero: true, 
                    max: 100, 
                    grid: { color: 'rgba(28, 35, 23, 0.04)' },
                    ticks: { color: '#8E9688', font: { size: 10, family: 'Pretendard' } }
                },
                x: { 
                    grid: { display: false },
                    ticks: { color: '#1C2317', font: { size: 11, weight: '700', family: 'Pretendard' } }
                }
            }
        }
    });
}

// 12. 초기 로딩 설정
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// 13. 전역 토스트 알림창
function showToastNotification(message, iconClass = "fa-solid fa-circle-check") {
    const toast = document.getElementById('toastNotification');
    if (toast) {
        toast.innerHTML = `<i class="${iconClass} toast-icon"></i> <span>${message}</span>`;
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, 3800);
    }
}
