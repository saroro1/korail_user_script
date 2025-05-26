// ==UserScript==
// @name         LetsKorail Seat Helper
// @namespace    http://saroro.dev
// @version      1.0.0
// @description  코레일톡 입석 자유석 표기
// @match        https://www.korail.com/ticket/search/list
// @grant        none
// @run-at       document-start
// @author       saroro (https://github.com/saroro1)
// ==/UserScript==

(function() {
    'use strict';

    let globalSeatMap = new Map();
    let currentRequestDate = null; // 날짜 저장
    let processedTrains = new Set(); // 열차 번호 저장

    // CSS 스타일 주입
    const style = document.createElement('style');
    style.textContent = `
        .hook-seat-info {
            margin-top: 8px !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 8px !important;
            font-size: 11px !important;
            font-weight: 500 !important;
            line-height: 1 !important;
            flex-wrap: wrap !important;
        }

        .hook-seat-badge {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 4px 8px !important;
            border-radius: 12px !important;
            font-size: 10px !important;
            font-weight: 600 !important;
            text-align: center !important;
            white-space: nowrap !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15) !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
            line-height: 1 !important;
            height: auto !important;
            min-height: 20px !important;
        }

        /* 열차 타입 스타일 - 더 가독성 높은 색상과 중앙정렬 개선 */
        .hook-train-type-a {
            background: linear-gradient(135deg, #ff6b6b, #ff4757) !important;
            color: white !important;
            font-weight: 700 !important;
            font-size: 11px !important;
            padding: 4px 10px !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;
            text-align: center !important;
            min-width: 50px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            line-height: 1 !important;
            height: auto !important;
            min-height: 20px !important;
        }

        .hook-train-type-b {
            background: linear-gradient(135deg, #a29bfe, #6c5ce7) !important;
            color: white !important;
            font-weight: 700 !important;
            font-size: 11px !important;
            padding: 4px 10px !important;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2) !important;
            text-align: center !important;
            min-width: 50px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            line-height: 1 !important;
            height: auto !important;
            min-height: 20px !important;
        }

        /* 좌석 상태 컨테이너 - 가로 배치로 변경 */
        .hook-seat-status {
            display: flex !important;
            flex-direction: row !important;
            gap: 4px !important;
            align-items: center !important;
        }

        /* 입석 상태별 색상 */
        .hook-standby-available {
            background: linear-gradient(135deg, #00b894, #00a085) !important;
            color: white !important;
        }

        .hook-standby-sold-out {
            background: linear-gradient(135deg, #e17055, #d63031) !important;
            color: white !important;
        }

        .hook-standby-station-only {
            background: linear-gradient(135deg, #fdcb6e, #e17055) !important;
            color: white !important;
        }

        .hook-standby-unavailable {
            background: linear-gradient(135deg, #636e72, #2d3436) !important;
            color: white !important;
        }

        /* 자유석 상태별 색상 */
        .hook-free-available {
            background: linear-gradient(135deg, #0984e3, #74b9ff) !important;
            color: white !important;
        }

        .hook-free-sold-out {
            background: linear-gradient(135deg, #e17055, #d63031) !important;
            color: white !important;
        }

        .hook-free-unavailable {
            background: linear-gradient(135deg, #636e72, #2d3436) !important;
            color: white !important;
        }

        /* 애니메이션 효과 - 한 번만 실행 */
        .hook-seat-info.hook-animated {
            animation: slideInUp 0.3s ease-out !important;
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .hook-seat-badge:hover {
            transform: scale(1.05) !important;
            transition: transform 0.2s ease !important;
        }

        /* 열차 시설 정보 스타일 - 크기 증가 */
        .hook-facilities {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 4px !important;
            align-items: center !important;
        }

        .hook-facility-item {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 4px 8px !important;
            background: linear-gradient(135deg, #00cec9, #00b894) !important;
            color: white !important;
            font-size: 10px !important;
            font-weight: 600 !important;
            border-radius: 8px !important;
            white-space: nowrap !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15) !important;
            border: 1px solid rgba(255,255,255,0.2) !important;
            line-height: 1 !important;
            height: auto !important;
            min-height: 20px !important;
        }

        /* 반응형 디자인 */
        @media (max-width: 480px) {
            .hook-seat-info {
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 6px !important;
            }

            .hook-seat-status {
                gap: 4px !important;
            }

            .hook-facilities {
                width: 100% !important;
                gap: 3px !important;
            }

            .hook-seat-badge {
                font-size: 9px !important;
                padding: 2px 6px !important;
            }

            .hook-train-type-a,
            .hook-train-type-b {
                font-size: 10px !important;
                padding: 3px 8px !important;
                min-width: 45px !important;
            }

            .hook-facility-item {
                font-size: 9px !important;
                padding: 2px 6px !important;
            }
        }
    `;
    document.head.appendChild(style);


    function injectSeatInfo(responseJson, requestDate = null) {
        const infoList = responseJson.trn_infos?.trn_info || [];

        // 날짜가 없으면 기본값 사용 (현재 날짜)
        const dateKey = requestDate || new Date().toISOString().slice(0, 10).replace(/-/g, '');

        //날짜 감지
        if (currentRequestDate && currentRequestDate !== dateKey) {
            globalSeatMap.clear();
            processedTrains.clear();
            console.log(`[KorailHook] 날짜 변경 감지 (${currentRequestDate} → ${dateKey}), Map 초기화`);
        }

        // 현재 요청 날짜 업데이트
        currentRequestDate = dateKey;

        // 새 데이터 추가
        infoList.forEach(rec => {
            const tn = rec.h_trn_no;
            const uniqueKey = `${dateKey}_${tn}`; // 날짜와 열차번호 조합

            // 산천 A B타입
            let trainType = '';
            let trainTypeClass = '';
            if (rec.h_trn_clsf_cd === '07') {
                trainType = 'A-Type';
                trainTypeClass = 'hook-train-type-a';
            } else if (rec.h_trn_clsf_cd === '10') {
                trainType = 'B-Type';
                trainTypeClass = 'hook-train-type-b';
            }

            // 입석 여부
            let standbyText, standbyClass;
            switch (rec.h_stnd_rsv_cd) {
                case '00':
                    standbyText = '입석 판매 중 아님';
                    standbyClass = 'hook-standby-unavailable';
                    break;
                case '01':
                    standbyText = '입석 역 판매 중';
                    standbyClass = 'hook-standby-station-only';
                    break;
                case '13':
                    standbyText = '입석 매진';
                    standbyClass = 'hook-standby-sold-out';
                    break;
                default:
                    standbyText = '입석 불가';
                    standbyClass = 'hook-standby-unavailable';
                    break;
            }

            // 자유석 여부
            let freeText, freeClass, showFree = true;
            const cnt = parseInt(rec.h_free_sracar_cnt, 10) || 0;
            if(cnt === 0) {
                showFree = false; // 자유석 배정된 칸이 없으면 없는거지 뭐
            }
            else if (rec.h_free_rsv_cd === '13') {
                freeText = '자유석 매진';
                freeClass = 'hook-free-sold-out';
            } else if (rec.h_free_rsv_cd === '01') {
                freeText = `자유석 ${cnt}량`;
                freeClass = 'hook-free-available';
            } else {
                freeText = `자유석 불가`;
                freeClass = 'hook-free-unavailable';
            }

            // 시설 정보
            const facilities = [];
            for (let i = 1; i <= 5; i++) {
                const facilityName = rec[`h_trn_cps_nm${i}`];
                if (facilityName && facilityName.trim()) {
                    facilities.push(facilityName.trim());
                }
            }


            globalSeatMap.set(uniqueKey, {
                trainType, trainTypeClass, standbyText, standbyClass, freeText, freeClass, facilities, showFree,
                trainNo: tn, // 원본 열차번호도 저장
                date: dateKey // 날짜도 저장
            });
        });

        // 현재 페이지의 모든 열차 항목에 정보 적용
        applyAllSeatInfo();


    }

    // 현재 DOM에 있는 모든 열차에 저장된 정보 적용
    function applyAllSeatInfo() {
        const dateKey = currentRequestDate || new Date().toISOString().slice(0, 10).replace(/-/g, '');

        document.querySelectorAll('.tckWrap ul > li.tckList').forEach(li => {
            const numEl = li.querySelector('.tit_box .num');
            const durationEl = li.querySelector('.s_txt');
            if (!numEl || !durationEl) return;

            const trainNo = numEl.textContent.trim();
            const uniqueKey = `${dateKey}_${trainNo}`;
            const info = globalSeatMap.get(uniqueKey);

            // 기존 정보가 있으면 제거
            const existing = li.querySelector('.hook-seat-info');
            if (existing) existing.remove();

            if (!info) return;

            // 새로 추가된 열차인지 확인 에니메이션
            const isNewTrain = !processedTrains.has(uniqueKey);
            if (isNewTrain) {
                processedTrains.add(uniqueKey);
            }

            // 메인 컨테이너 (가로 배치)
            const container = document.createElement('div');
            // 새로운 열차만 애니메이션 추가
            container.className = isNewTrain ? 'hook-seat-info hook-animated' : 'hook-seat-info';

            // 1. 산천 타입
            if (info.trainType) {
                const typeBadge = document.createElement('span');
                typeBadge.className = `hook-seat-badge ${info.trainTypeClass}`;
                typeBadge.textContent = info.trainType;
                container.appendChild(typeBadge);
            }

            // 2. 좌석 상태
            const seatStatusContainer = document.createElement('div');
            seatStatusContainer.className = 'hook-seat-status';

            // 입석 여부
            const standbyBadge = document.createElement('span');
            standbyBadge.className = `hook-seat-badge ${info.standbyClass}`;
            standbyBadge.textContent = info.standbyText;
            seatStatusContainer.appendChild(standbyBadge);

            // 자유석 여부
            if (info.showFree) {
                const freeBadge = document.createElement('span');
                freeBadge.className = `hook-seat-badge ${info.freeClass}`;
                freeBadge.textContent = info.freeText;
                seatStatusContainer.appendChild(freeBadge);
            }

            container.appendChild(seatStatusContainer);

            // 3. 열차 시설 정보
            if (info.facilities && info.facilities.length > 0) {
                const facilitiesContainer = document.createElement('div');
                facilitiesContainer.className = 'hook-facilities';

                info.facilities.forEach(facility => {
                    const facilityItem = document.createElement('span');
                    facilityItem.className = 'hook-facility-item';
                    facilityItem.textContent = facility;
                    facilitiesContainer.appendChild(facilityItem);
                });

                container.appendChild(facilitiesContainer);
            }

            // "소요시간"뒤에 삽입
            durationEl.insertAdjacentElement('afterend', container);

            // 새로운 열차에만 애니메이션 완료 후 클래스 제거
            if (isNewTrain) {
                setTimeout(() => {
                    container.classList.remove('hook-animated');
                }, 300);
            }
        });
    }

    // DOM 변화 감지해서 새로운 열차 항목에 정보 적용
    const observer = new MutationObserver((mutations) => {
        let hasNewTrains = false;
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1 && (
                    node.classList?.contains('tckList') ||
                    node.querySelector?.('.tckList')
                )) {
                    hasNewTrains = true;
                }
            });
        });

        if (hasNewTrains) {
            setTimeout(() => applyAllSeatInfo(), 50); // 짧은 지연 후 적용
        }
    });

    // DOM 감시 시작
    setTimeout(() => {
        const targetNode = document.querySelector('.tckWrap') || document.body;
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
    }, 1000);

    // —————————————————————————————————————————————————————
    // Fetch 후킹
    const _origFetch = window.fetch;
    window.fetch = function(...args) {
        let requestDate = null;

        // 요청 body에서 날짜 정보 추출
        if (args[1] && args[1].body) {
            try {
                const body = args[1].body;
                if (typeof body === 'string') {
                    const params = new URLSearchParams(body);
                    requestDate = params.get('txtGoAbrdDt');
                } else if (body instanceof FormData) {
                    requestDate = body.get('txtGoAbrdDt');
                }
            } catch (err) {
                console.warn('[KorailHook][fetch] 요청 body 파싱 실패', err);
            }
        }

        return _origFetch.apply(this, args)
            .then(response => {
                if (response.url.includes('/classes/com.korail.mobile.seatMovie.ScheduleView')) {
                    response.clone().json()
                        .then(json => {
                            setTimeout(() => injectSeatInfo(json, requestDate), 100); // 날짜 정보 전달
                        })
                        .catch(err => console.error('[KorailHook][fetch] JSON 파싱 오류', err));
                }
                return response;
            })
            .catch(err => { console.error('[KorailHook][fetch] 오류', err); throw err; });
    };
    // —————————————————————————————————————————————————————

    // —————————————————————————————————————————————————————
    // XHR 후킹
    const _origOpen = XMLHttpRequest.prototype.open;
    const _origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._hookedUrl = url;
        return _origOpen.call(this, method, url, ...rest);
    };

    XMLHttpRequest.prototype.send = function(body) {
        let requestDate = null;

        // 요청 body에서 날짜 정보 추출
        if (body) {
            try {
                if (typeof body === 'string') {
                    const params = new URLSearchParams(body);
                    requestDate = params.get('txtGoAbrdDt');
                } else if (body instanceof FormData) {
                    requestDate = body.get('txtGoAbrdDt');
                }
            } catch (err) {
                console.warn('[KorailHook][XHR] 요청 body 파싱 실패', err);
            }
        }

        this.addEventListener('readystatechange', () => {
            if (this.readyState === 4 && this._hookedUrl.includes('/classes/com.korail.mobile.seatMovie.ScheduleView')) {
                try {
                    const json = JSON.parse(this.responseText);
                    setTimeout(() => injectSeatInfo(json, requestDate), 100); // 날짜 정보 전달
                } catch (err) {
                    console.error('[KorailHook][XHR] JSON 파싱 오류', err);
                }
            }
        });
        return _origSend.call(this, body);
    };
    // —————————————————————————————————————————————————————

})();