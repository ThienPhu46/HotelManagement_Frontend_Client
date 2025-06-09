import { useState } from "react";
import "../Components_Css/HeaderBookingRoom.css";

export default function HeaderBookingRoom({ currentStep, onStepChange }) {
  const [dateRange, setDateRange] = useState("11 Tháng Bảy - 12 Tháng Bảy");
  const [guests, setGuests] = useState("1 phòng, 1 người lớn");
  const [promoCode, setPromoCode] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);
  const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
  const [currentMonth, setCurrentMonth] = useState(7);
  const [currentYear] = useState(2025);
  const [selectionStep, setSelectionStep] = useState(0);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const handleDateClick = () => {
    // Sửa lại để có thể bật/tắt khi bấm lại
    setShowCalendar(!showCalendar);
    setShowGuestSelector(false);
  };

  const handleGuestClick = () => {
    // Sửa lại để có thể bật/tắt khi bấm lại
    setShowGuestSelector(!showGuestSelector);
    setShowCalendar(false);
  };

  const handleDateSelection = (date) => {
    if (selectionStep === 0 || selectionStep === 2) {
      setSelectedDates({ start: date, end: null });
      setSelectionStep(1);
    } else if (selectionStep === 1) {
      if (date < selectedDates.start) {
        setSelectedDates({ start: date, end: selectedDates.start });
      } else {
        setSelectedDates({ ...selectedDates, end: date });
      }
      setSelectionStep(2);

      const startDate = `${selectedDates.start} Tháng ${currentMonth}`;
      const endDate = date < selectedDates.start ? `${selectedDates.start} Tháng ${currentMonth}` : `${date} Tháng ${currentMonth}`;
      setDateRange(`${startDate} - ${endDate}`);
    }
  };

  // Cập nhật các hàm xử lý nút bấm để nhận event (e)
  const handleGuestSelection = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên trên
    setGuests(`${rooms} phòng, ${adults} người lớn${children > 0 ? `, ${children} trẻ em` : ""}`);
    setShowGuestSelector(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên trên
    setShowCalendar(false);
    setShowGuestSelector(false);
  };

  const handleCalendarDone = (e) => {
    e.stopPropagation(); // Ngăn sự kiện lan truyền lên trên
    if (selectedDates.start && !selectedDates.end) {
      setSelectedDates({ start: selectedDates.start, end: selectedDates.start });
      setDateRange(
        `${selectedDates.start} Tháng ${currentMonth} - ${selectedDates.start} Tháng ${currentMonth}`
      );
    }
    setShowCalendar(false);
  };

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (currentMonth > 1) {
      setCurrentMonth(currentMonth - 1);
    } else {
      setCurrentMonth(12);
    }
    setSelectedDates({ start: null, end: null });
    setSelectionStep(0);
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (currentMonth < 12) {
      setCurrentMonth(currentMonth + 1);
    } else {
      setCurrentMonth(1);
    }
    setSelectedDates({ start: null, end: null });
    setSelectionStep(0);
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const daysFromPrevMonth = firstDay === 0 ? 6 : firstDay - 1;
    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const daysInPrevMonth = getDaysInMonth(currentYear, prevMonth);
    const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;

    const dates = [];
    for (let i = daysInPrevMonth - daysFromPrevMonth + 1; i <= daysInPrevMonth; i++) {
      dates.push({ day: i, month: prevMonth, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      dates.push({ day: i, month: currentMonth, isCurrentMonth: true });
    }
    for (let i = 1; i <= 42 - dates.length; i++) {
      dates.push({ day: i, month: nextMonth, isCurrentMonth: false });
    }

    const weeks = [];
    for (let i = 0; i < dates.length; i += 7) {
      weeks.push(dates.slice(i, i + 7));
    }

    const monthNames = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
    ];

    return (
      <div className="calendar-popup" style={{ width: "400px", padding: "10px" }}>
        <div className="calendar-header">
          <button className="calendar-nav-btn" onClick={handlePrevMonth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <h3 style={{ fontSize: "14px" }}>
            {monthNames[currentMonth - 1]} {currentYear}
          </h3>
          <button className="calendar-nav-btn" onClick={handleNextMonth}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div className="calendar-table">
          <div className="calendar-header">
            {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, index) => (
              <div key={index} className="calendar-day-header" style={{ fontSize: "11px" }}>
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-body">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="calendar-row">
                {week.map((date, dateIndex) => {
                  const isSelected =
                    date.isCurrentMonth &&
                    ((selectedDates.start === date.day && selectedDates.end === null) ||
                      selectedDates.start === date.day ||
                      selectedDates.end === date.day ||
                      (selectedDates.start !== null &&
                        selectedDates.end !== null &&
                        date.day > selectedDates.start &&
                        date.day < selectedDates.end));
                  const isInRange =
                    date.isCurrentMonth &&
                    selectedDates.start !== null &&
                    selectedDates.end !== null &&
                    date.day > selectedDates.start &&
                    date.day < selectedDates.end;

                  return (
                    <div
                      key={dateIndex}
                      className={`calendar-date ${!date.isCurrentMonth ? "other-month" : ""} ${isSelected ? "selected" : ""} ${isInRange ? "in-range" : ""}`}
                      style={{ padding: "5px", fontSize: "12px" }}
                      onClick={(e) => { e.stopPropagation(); if (date.isCurrentMonth) handleDateSelection(date.day); }}
                    >
                      {date.day}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="calendar-actions">
          <button className="calendar-cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="calendar-done-btn" onClick={handleCalendarDone}>
            Done
          </button>
        </div>
      </div>
    );
  };

  const renderGuestSelector = () => {
    return (
      <div className="guest-selector-popup">
        <div className="guest-selector-header">
          <div className="max-guests-info">
            Tối đa 6 người cho mỗi phòng <span className="info-icon">ⓘ</span>
          </div>
        </div>
        <div className="room-selection">
          <div className="room-label">Phòng 1</div>
          <div className="guest-type-row">
            <div className="guest-type">Người lớn</div>
            <div className="guest-counter">
              <input type="number" value={adults} min={1} max={6} onChange={(e) => setAdults(Number.parseInt(e.target.value))} />
              <div className="counter-buttons">
                <button className="counter-btn" onClick={(e) => { e.stopPropagation(); if (adults > 1) setAdults(adults - 1); }}>▲</button>
                <button className="counter-btn" onClick={(e) => { e.stopPropagation(); if (adults < 6) setAdults(adults + 1); }}>▼</button>
              </div>
            </div>
          </div>
          <div className="guest-type-row">
            <div className="guest-type">Trẻ em<div className="age-limit">≤ 5 tuổi</div></div>
            <div className="guest-counter">
              <input type="number" value={children} min={0} max={5} onChange={(e) => setChildren(Number.parseInt(e.target.value))} />
              <div className="counter-buttons">
                <button className="counter-btn" onClick={(e) => { e.stopPropagation(); if (children > 0) setChildren(children - 1); }}>▲</button>
                <button className="counter-btn" onClick={(e) => { e.stopPropagation(); if (children < 5) setChildren(children + 1); }}>▼</button>
              </div>
            </div>
          </div>
        </div>
        <button className="add-room-btn" onClick={(e) => e.stopPropagation()}>+ Thêm phòng</button>
        <div className="guest-selector-actions">
          <button className="guest-cancel-btn" onClick={handleCancel}>Hủy</button>
          <button className="guest-apply-btn" onClick={handleGuestSelection}>ÁP DỤNG</button>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <div className="header-container">
        <img src="./Img_User/Img_BookingRoom_Header.png" alt="Luxury hotel room with mountain view" className="header-image"/>
        <a href="/">
          <div className="home-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="44" viewBox="0 0 38 44" fill="none"><path d="M-1.09278e-06 22L37.5 0.349367L37.5 43.6506L-1.09278e-06 22Z" fill="#1D3E92" /></svg>
            <span>Trang chủ</span>
          </div>
        </a>   
      </div>
      <div className="content">
        <div className="booking-steps">
          <div className={`step ${currentStep === 1 ? "active" : ""}`} onClick={() => onStepChange(1)}><div className="step-number">1</div><span className="step-text">Chọn phòng</span></div>
          <div className={`step ${currentStep === 2 ? "active" : ""}`} onClick={() => onStepChange(2)}><div className="step-number">2</div><span className="step-text">Chọn dịch vụ thêm</span></div>
          <div className={`step ${currentStep === 3 ? "active" : ""}`} onClick={() => onStepChange(3)}><div className="step-number">3</div><span className="step-text">Đặt phòng</span></div>
        </div>
        <div className="booking-form-container">
          <div className="booking-form">
            <div className="form-section" onClick={handleDateClick}>
              <div className="icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none"><path d="M17.3333 9.2124C17.75 9.46598 18.1215 9.75358 18.4479 10.0752C18.7743 10.3968 19.0556 10.7493 19.2917 11.1328C19.5278 11.5163 19.7014 11.9214 19.8125 12.3481C19.9236 12.7749 19.9861 13.2109 20 13.6562C20 14.3923 19.8438 15.085 19.5312 15.7344C19.2188 16.3838 18.7882 16.9497 18.2396 17.4321C17.691 17.9146 17.0556 18.2949 16.3333 18.5732C15.6111 18.8516 14.8333 18.9938 14 19C13.3681 19 12.7569 18.9165 12.1667 18.7495C11.5764 18.5825 11.0347 18.3413 10.5417 18.0259C10.0486 17.7104 9.61111 17.3332 9.22917 16.894C8.84722 16.4549 8.55208 15.9694 8.34375 15.4375H0V1.1875H2.66667V0H4V1.1875H13.3333V0H14.6667V1.1875H17.3333V9.2124ZM1.33333 2.375V4.75H16V2.375H14.6667V3.5625H13.3333V2.375H4V3.5625H2.66667V2.375H1.33333ZM8.03125 14.25C8.01042 14.0583 8 13.8604 8 13.6562C8 13.1243 8.08333 12.6079 8.25 12.1069C8.41667 11.606 8.67014 11.1328 9.01042 10.6875H8V9.5H9.33333V10.2979C9.61806 9.98242 9.93403 9.7041 10.2812 9.46289C10.6285 9.22168 11.0035 9.01449 11.4062 8.84131C11.809 8.66813 12.2292 8.53825 12.6667 8.45166C13.1042 8.36507 13.5486 8.31868 14 8.3125C14.6944 8.3125 15.3611 8.41455 16 8.61865V5.9375H1.33333V14.25H8.03125ZM14 17.8125C14.6458 17.8125 15.25 17.7043 15.8125 17.4878C16.375 17.2713 16.8681 16.9744 17.2917 16.5972C17.7153 16.2199 18.0486 15.7808 18.2917 15.2798C18.5347 14.7788 18.6597 14.2376 18.6667 13.6562C18.6667 13.0811 18.5451 12.543 18.3021 12.042C18.059 11.541 17.7257 11.1019 17.3021 10.7246C16.8785 10.3473 16.3854 10.0505 15.8229 9.83398C15.2604 9.61751 14.6528 9.50618 14 9.5C13.3542 9.5 12.75 9.60824 12.1875 9.82471C11.625 10.0412 11.1319 10.3381 10.7083 10.7153C10.2847 11.0926 9.95139 11.5317 9.70833 12.0327C9.46528 12.5337 9.34028 13.0749 9.33333 13.6562C9.33333 14.2314 9.45486 14.7695 9.69792 15.2705C9.94097 15.7715 10.2743 16.2106 10.6979 16.5879C11.1215 16.9652 11.6146 17.262 12.1771 17.4785C12.7396 17.695 13.3472 17.8063 14 17.8125ZM14.6667 13.0625H16.6667V14.25H13.3333V10.6875H14.6667V13.0625ZM2.66667 9.5H4V10.6875H2.66667V9.5ZM5.33333 9.5H6.66667V10.6875H5.33333V9.5ZM5.33333 7.125H6.66667V8.3125H5.33333V7.125ZM5.33333 11.875H6.66667V13.0625H5.33333V11.875ZM9.33333 8.3125H8V7.125H9.33333V8.3125ZM12 8.3125H10.6667V7.125H12V8.3125ZM2.66667 7.125H4V8.3125H2.66667V7.125Z" fill="#2D74BB"/></svg>
              </div>
              <div className="form-content"><div className="form-value">{dateRange}</div></div>
              <div className="dropdown-icon"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M5 6L0.669874 -1.38009e-07L9.33013 -8.95112e-07L5 6Z" fill="#2D74BB" /></svg></div>
              {showCalendar && renderCalendar()}
            </div>
            <div className="form-section" onClick={handleGuestClick}>
              <div className="icon-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 3.15789C7 2.32037 7.31607 1.51715 7.87868 0.924926C8.44129 0.332706 9.20435 0 10 0C10.7956 0 11.5587 0.332706 12.1213 0.924926C12.6839 1.51715 13 2.32037 13 3.15789C13 3.99542 12.6839 4.79864 12.1213 5.39086C11.5587 5.98308 10.7956 6.31579 10 6.31579C9.20435 6.31579 8.44129 5.98308 7.87868 5.39086C7.31607 4.79864 7 3.99542 7 3.15789ZM16.5 1.05263C15.837 1.05263 15.2011 1.32989 14.7322 1.8234C14.2634 2.31692 14 2.98627 14 3.68421C14 4.38215 14.2634 5.0515 14.7322 5.54502C15.2011 6.03853 15.837 6.31579 16.5 6.31579C17.163 6.31579 17.7989 6.03853 18.2678 5.54502C18.7366 5.0515 19 4.38215 19 3.68421C19 2.98627 18.7366 2.31692 18.2678 1.8234C17.7989 1.32989 17.163 1.05263 16.5 1.05263ZM3.5 1.05263C2.83696 1.05263 2.20107 1.32989 1.73223 1.8234C1.26339 2.31692 1 2.98627 1 3.68421C1 4.38215 1.26339 5.0515 1.73223 5.54502C2.20107 6.03853 2.83696 6.31579 3.5 6.31579C4.16304 6.31579 4.79893 6.03853 5.26777 5.54502C5.73661 5.0515 6 4.38215 6 3.68421C6 2.98627 5.73661 2.31692 5.26777 1.8234C4.79893 1.32989 4.16304 1.05263 3.5 1.05263ZM7.625 7.36842C7.06141 7.36842 6.52091 7.60409 6.1224 8.02358C5.72388 8.44307 5.5 9.01202 5.5 9.60526V15.2632C5.5 16.5194 5.97411 17.7243 6.81802 18.6126C7.66193 19.5009 8.80653 20 10 20C11.1935 20 12.3381 19.5009 13.182 18.6126C14.0259 17.7243 14.5 16.5194 14.5 15.2632V9.60526C14.5 9.01202 14.2761 8.44307 13.8776 8.02358C13.4791 7.60409 12.9386 7.36842 12.375 7.36842H7.625ZM4.5 9.60526C4.5 8.76316 4.801 7.99421 5.296 7.41211C5.15737 7.38301 5.01636 7.36838 4.875 7.36842H2.125C1.56142 7.36842 1.02091 7.60409 0.622398 8.02358C0.223883 8.44307 1.33566e-07 9.01202 1.33566e-07 9.60526V14.7368C-0.000166827 15.3731 0.156197 15.9985 0.453865 16.5523C0.751533 17.106 1.18036 17.5691 1.69858 17.8966C2.2168 18.2241 2.80675 18.4047 3.41098 18.4209C4.01522 18.4371 4.61313 18.2883 5.1465 17.9889C4.72069 17.1504 4.49859 16.214 4.5 15.2632V9.60526ZM15.5 15.2632C15.5 16.2484 15.266 17.1763 14.8535 17.9889C15.3869 18.2883 15.9848 18.4371 16.589 18.4209C17.1932 18.4047 17.7832 18.2241 18.3014 17.8966C18.8196 17.5691 19.2485 17.106 19.5461 16.5523C19.8438 15.9985 20.0002 15.3731 20 14.7368V9.60526C20 9.01202 19.7761 8.44307 19.3776 8.02358C18.9791 7.60409 18.4386 7.36842 17.875 7.36842H15.125C14.9807 7.36877 14.8403 7.38333 14.704 7.41211C15.2174 8.01468 15.5009 8.79585 15.5 9.60526V15.2632Z" fill="#2D74BB"/></svg>
              </div>
              <div className="form-content"><div className="form-value">{guests}</div></div>
              <div className="dropdown-icon"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M5 6L0.669874 -1.38009e-07L9.33013 -8.95112e-07L5 6Z" fill="#2D74BB" /></svg></div>
              {showGuestSelector && renderGuestSelector()}
            </div>
            <div className="form-section">
              <div className="icon-container">%</div>
              <div className="form-content">
                <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="form-input" placeholder="Nhập mã khuyến mãi"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}