import { useState, useEffect } from "react";
import "../../Design_Css/User/Booking_Room.css";
import HeaderBookingRoom from "../../Components/User/Components_Js/HeaderBookingRoom";
import FooterUser from "../../Components/User/Components_Js/FooterUser";
import Notification_BookingRoom from "../../Components/User/Components_Js/Notification_BookingRoom";
import { useNavigate } from "react-router-dom"; // Import useNavigate để chuyển hướng

// Lấy ngày hôm nay
const today = new Date();
// Lấy ngày mai
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);


export default function Booking_Room_LoggedIn() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [remainingChars, setRemainingChars] = useState(500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  const [rooms, setRooms] = useState([]);
  const [availableServices, setAvailableServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState(null);
  const [currentImageIndices, setCurrentImageIndices] = useState({});
  const navigate = useNavigate(); // Khởi tạo useNavigate

  // --- THAY ĐỔI: ĐÃ XÓA STATE 'customerInfo' ---

  const getAvailableRoomsUrl = () => {
    const url = new URL("http://localhost:5282/api/rooms");
    url.searchParams.append("trangThai", "Trống");
    url.searchParams.append("tinhTrang", "Đã dọn dẹp");
    url.searchParams.append("pageSize", "100"); 
    return url.toString();
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [roomTypesResponse, servicesResponse, availableRoomsResponse] = await Promise.all([
          fetch("http://localhost:5282/api/room-types?pageSize=100"),
          fetch("http://localhost:5282/api/services?pageSize=100"),
          fetch(getAvailableRoomsUrl())
        ]);

        if (!roomTypesResponse.ok) throw new Error(`Lỗi tải loại phòng: ${roomTypesResponse.status}`);
        if (!servicesResponse.ok) throw new Error(`Lỗi tải dịch vụ: ${servicesResponse.status}`);
        
        if (!availableRoomsResponse.ok) {
            throw new Error(`Lỗi tải phòng trống: ${availableRoomsResponse.status}`);
        }

        const roomTypesResult = await roomTypesResponse.json();
        const servicesResult = await servicesResponse.json();
        const availableRoomsResult = await availableRoomsResponse.json();
        const availableRooms = availableRoomsResult.data || [];

        const staticRoomDataMap = {
          "Phòng Đơn": { bedType: "Giường đôi", capacity: "1 đêm, 1 người", images: ["./Img_User/Img_Room_1.png", "./Img_User/Img_Room_2.png"], features: [{ icon: "🍳", text: "Bao gồm bữa sáng" }, { icon: "❌", text: "Không thể hủy" }] },
          "Phòng Đôi": { bedType: "Giường đôi lớn", capacity: "1 đêm, 2 người", images: ["./Img_User/Img_Room_2.png", "./Img_User/Img_Room_3.png"], features: [{ icon: "🍳", text: "Bao gồm bữa sáng" }, { icon: "✓", text: "Miễn phí hủy" }] },
          "Phòng Deluxe": { bedType: "Giường King", capacity: "1 đêm, 2 người", images: ["./Img_User/Img_Room_3.png", "./Img_User/Img_Room_1.png"], features: [{ icon: "🍳", text: "Bữa sáng" }, { icon: "🛁", text: "Bồn tắm" }] },
        };

        const mappedRoomData = roomTypesResult.data.map((roomType) => {
          const staticData = staticRoomDataMap[roomType.tenLoaiPhong] || staticRoomDataMap["Phòng Deluxe"];
          
          const availabilityCount = availableRooms.filter(
            r => parseInt(r.loaiPhong, 10) === roomType.maLoaiPhong
          ).length;

          return {
            id: roomType.maLoaiPhong,
            name: roomType.tenLoaiPhong,
            title: `Phòng ${roomType.tenLoaiPhong}`,
            description: roomType.moTa,
            price: roomType.giaPhong,
            priceText: `${new Intl.NumberFormat("vi-VN").format(roomType.giaPhong)} VND`,
            availabilityCount: availabilityCount,
            ...staticData,
          };
        });
        setRooms(mappedRoomData);

        const initialImageIndices = {};
        mappedRoomData.forEach(room => {
            initialImageIndices[room.id] = 0;
        });
        setCurrentImageIndices(initialImageIndices);
        
        const mappedServiceData = servicesResult.data.map((service, index) => ({
            id: service.maDichVu,
            title: service.tenDichVu,
            price: service.gia,
            priceText: `${new Intl.NumberFormat("vi-VN").format(service.gia)} VND`,
            image: `./Img_User/Img_Service_${(index % 2) + 1}.png`,
            priceNote: `(${new Intl.NumberFormat("vi-VN").format(service.gia)} VND mỗi dịch vụ)`
        }));
        setAvailableServices(mappedServiceData);

      } catch (e) {
        setError(e.message);
        console.error("Lỗi chi tiết khi fetch:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // --- THAY ĐỔI: ĐÃ XÓA HÀM 'handleCustomerInfoChange' ---

  const handleBookNow = async () => {
    if (selectedRooms.length === 0) {
        alert("Vui lòng chọn ít nhất một phòng.");
        return;
    }
    
    // --- THAY ĐỔI: ĐÃ XÓA PHẦN KIỂM TRA 'customerInfo' ---

    setIsBooking(true);
    setError(null);

    const currentUserData = localStorage.getItem("currentUser");
    if (!currentUserData) {
        alert("Bạn cần đăng nhập để thực hiện chức năng này. Đang chuyển hướng đến trang đăng nhập...");
        setIsBooking(false);
        navigate('/LoginUser'); 
        return;
    }
    
    const user = JSON.parse(currentUserData);
    const customerIdForBooking = user.maKhachHang;

    if (!customerIdForBooking) {
        alert("Không tìm thấy thông tin khách hàng trong tài khoản của bạn. Vui lòng đăng nhập lại.");
        setIsBooking(false);
        localStorage.removeItem("currentUser");
        navigate('/LoginUser');
        return;
    }

    try {
        const availableRoomsResponse = await fetch(getAvailableRoomsUrl());

        if (!availableRoomsResponse.ok) {
            throw new Error("Không thể lấy danh sách phòng trống để đặt.");
        }
        const availableRoomsResult = await availableRoomsResponse.json();
        const allAvailableRooms = availableRoomsResult.data;

        const roomsToBook = [];
        const tempAvailableRooms = [...allAvailableRooms];

        for (const roomTypeId of selectedRooms) {
            const foundRoomIndex = tempAvailableRooms.findIndex(room => parseInt(room.loaiPhong, 10) === roomTypeId);
            
            if (foundRoomIndex === -1) {
                const roomTypeName = rooms.find(r => r.id === roomTypeId)?.name || 'đã chọn';
                throw new Error(`Xin lỗi, đã hết phòng trống cho loại phòng: ${roomTypeName}.`);
            }
            const roomToBook = tempAvailableRooms[foundRoomIndex];
            roomsToBook.push(roomToBook);
            tempAvailableRooms.splice(foundRoomIndex, 1);
        }

        const bookingPromises = roomsToBook.map(roomToBook => {
            const bookingPayload = {
                maKhachHang: customerIdForBooking,
                maPhong: roomToBook.maPhong,
                gioCheckIn: new Date(today.setHours(14, 0, 0, 0)).toISOString(),
                gioCheckOut: new Date(tomorrow.setHours(12, 0, 0, 0)).toISOString(),
                ngayDat: new Date().toISOString(),
                loaiTinhTien: "Nightly",
            };

            return fetch("http://localhost:5282/api/bookings", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingPayload)
            });
        });
        
        const bookingResponses = await Promise.all(bookingPromises);
        const createdBookings = [];

        for(const response of bookingResponses) {
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Tạo đặt phòng thất bại");
            }
            const result = await response.json();
            createdBookings.push(result.data);
        }

        if (createdBookings.length > 0) {
            const confirmationPromises = createdBookings.map(bookingId => {
                return fetch(`http://localhost:5282/api/bookings/${bookingId}/confirm`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                });
            });
            await Promise.all(confirmationPromises);
        }


        if (createdBookings.length > 0 && selectedServices.length > 0) {
            const firstBookingId = createdBookings[0];
            const servicePromises = selectedServices.map(serviceId => {
                const serviceData = availableServices.find(s => s.id === serviceId);
                if(!serviceData) return null;

                const servicePayload = {
                    maDatPhong: firstBookingId,
                    maDichVu: serviceData.id,
                    soLuong: 1,
                    gia: serviceData.price,
                    thanhTien: serviceData.price,
                    ngaySuDung: new Date().toISOString()
                };

                return fetch("http://localhost:5282/api/bookingservice", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(servicePayload)
                });
            }).filter(p => p !== null);

            await Promise.all(servicePromises);
        }
        
        setIsModalOpen(true);

    } catch (err) {
        alert(`Đã xảy ra lỗi khi đặt phòng: ${err.message}`);
    } finally {
        setIsBooking(false);
    }
  };

  // Các hàm helper khác giữ nguyên...
  function handleServiceToggle(serviceId) {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  }

  function handleRoomToggle(roomId) {
    setSelectedRooms((prev) => {
      if (prev.includes(roomId)) {
        return prev.filter((id) => id !== roomId);
      } else {
        return [...prev, roomId];
      }
    });
  }

  function calculateTotal() {
    let total = 0;
    for (const roomId of selectedRooms) {
      const selectedRoomData = rooms.find((room) => room.id === roomId);
      if (selectedRoomData) {
        total += selectedRoomData.price;
      }
    }
    for (const serviceId of selectedServices) {
        const selectedServiceData = availableServices.find((s) => s.id === serviceId);
        if(selectedServiceData){
            total += selectedServiceData.price;
        }
    }
    return new Intl.NumberFormat("vi-VN").format(total);
  }

  function handleNextStep() {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleTextAreaChange(e) {
    const text = e.target.value;
    setAdditionalInfo(text);
    setRemainingChars(500 - text.length);
  }

  function handlePrevImage(roomId) {
    setCurrentImageIndices((prev) => {
      const room = rooms.find((r) => r.id === roomId);
      if (!room) return prev;
      const currentIndex = prev[roomId] || 0;
      const newIndex = currentIndex === 0 ? room.images.length - 1 : currentIndex - 1;
      return { ...prev, [roomId]: newIndex };
    });
  }

  function handleNextImage(roomId) {
    setCurrentImageIndices((prev) => {
      const room = rooms.find((r) => r.id === roomId);
      if (!room) return prev;
      const currentIndex = prev[roomId] || 0;
      const newIndex = currentIndex === room.images.length - 1 ? 0 : currentIndex + 1;
      return { ...prev, [roomId]: newIndex };
    });
  }

  function handleDotClick(roomId, index) {
    setCurrentImageIndices((prev) => ({
      ...prev,
      [roomId]: index,
    }));
  }

  function renderStep1() {
    if (loading) return <div className="step-container"><p>Đang tải dữ liệu...</p></div>;
    if (error) return <div className="step-container"><p className="error-message">{error}</p></div>;

    return (
      <div className="step-container">
        <h1 className="page-title">Chọn phòng</h1>
        <p className="page-subtitle">
          <strong>Tự tin đặt phòng:</strong> bạn đang trên trang web của khách sạn.
        </p>

        {rooms.map((room) => {
            const isAvailable = room.availabilityCount > 0;
            return (
                <div className={`room-card ${!isAvailable ? 'disabled' : ''}`} key={room.id}>
                    <div className="room-header">
                        <h2>{room.name}</h2>
                    </div>
                    {room.images && room.images.length > 0 && (
                    <div className="room-image-container">
                    <div className="image-slider">
                        {room.images.map((image, index) => (
                        <img
                            key={index}
                            src={image || "/placeholder.svg"}
                            alt={`${room.name} ${index + 1}`}
                            className={`room-image ${index === (currentImageIndices[room.id] || 0) ? "active" : ""}`}
                        />
                        ))}
                    </div>
                    <div className="navigation-buttons">
                        <button className="nav-button prev" onClick={() => handlePrevImage(room.id)}><span>❮</span></button>
                        <button className="nav-button next" onClick={() => handleNextImage(room.id)}><span>❯</span></button>
                    </div>
                    <div className="image-dots">
                        {room.images.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${index === (currentImageIndices[room.id] || 0) ? "active" : ""}`}
                            onClick={() => handleDotClick(room.id, index)}
                        ></span>
                        ))}
                    </div>
                    </div>
                    )}

                    <div className="room-details">
                    <div className="room-details-left">
                        <h3 className="room-name">{room.title}</h3>
                        <p className="room-description">{room.description}</p>
                        <div className="room-features">
                        {room.features && room.features.map((feature, index) => (
                            <div className="feature" key={index}><span className="feature-icon">{feature.icon}</span><span>{feature.text}</span></div>
                        ))}
                        </div>
                    </div>
                    <div className="room-details-right">
                        {isAvailable ? (
                            <div className="availability-info">Còn {room.availabilityCount} phòng</div>
                        ) : (
                            <div className="availability-info sold-out">Hết phòng</div>
                        )}
                        <div className="room-price"><span>{room.priceText}</span></div>
                        <button 
                            className={`apply-button ${selectedRooms.includes(room.id) ? "selected" : ""}`} 
                            onClick={() => handleRoomToggle(room.id)}
                            disabled={!isAvailable}
                        >
                        {selectedRooms.includes(room.id) ? "ĐÃ CHỌN" : "ÁP DỤNG"}
                        </button>
                    </div>
                    </div>
                    <div className="tax-info">Bao gồm thuế VAT / thuế tiêu thụ</div>
                </div>
            );
        })}
      </div>
    );
  }

  function renderStep2() {
    if (loading) return <div className="step-container"><p>Đang tải dữ liệu...</p></div>;
    if (error) return <div className="step-container"><p className="error-message">{error}</p></div>;
    
    return (
      <div className="step-container">
        <h1 className="page-title">Chọn dịch vụ thêm cho kỳ nghỉ của bạn</h1>
        <p className="page-subtitle">
          <strong>Tự tin đặt phòng:</strong> bạn đang trên trang web của khách sạn.
        </p>
        <div className="section-header"><h2>Dịch vụ thêm cho kỳ nghỉ của bạn</h2></div>
        
        {availableServices.length > 0 ? availableServices.map((service) => (
             <div className="service-item" key={service.id}>
             <div className="service-image"><img src={service.image} alt={service.title} className="service-img" /></div>
             <div className="service-details">
               <h3 className="service-title">{service.title}</h3>
               <button className="service-detail-btn">Chi tiết ▸</button>
               <p className="service-price">{service.priceText} <span className="price-note">{service.priceNote}</span></p>
               <p className="service-tax">Bao gồm thuế VAT / thuế tiêu thụ</p>
             </div>
             <div className="service-action">
               <div className="checkbox-container">
                 <span className="checkbox-label">Chọn</span>
                 <div className={`checkbox ${selectedServices.includes(service.id) ? "checked" : ""}`} onClick={() => handleServiceToggle(service.id)}></div>
               </div>
             </div>
           </div>
        )) : <p>Không có dịch vụ nào.</p>}

        <div className="section-header"><h2>Yêu cầu bổ sung</h2></div>
        <div className="additional-info">
          <p>Vui lòng cung cấp thêm thông tin: thời gian đến, sở thích ăn uống, số thẻ thành viên...</p>
          <textarea className="info-textarea" value={additionalInfo} onChange={handleTextAreaChange} maxLength={500}/>
          <div className="char-count">{remainingChars}/500</div>
          <p className="info-note">
            Yêu cầu đặc biệt của quý khách sẽ được xem xét cẩn thận, chúng tôi sẽ cố gắng để đáp ứng các yêu cầu đặc biệt của quý khách.
          </p>
        </div>
      </div>
    );
  }

  function renderStep3() {
    return (
      <div className="step-container">
        <h1 className="page-title">Kết thúc kỳ nghỉ của bạn</h1>
        <p className="page-subtitle"><strong>Tự tin đặt phòng:</strong> bạn đang trên trang web của khách sạn.</p>
        <div className="hotel-info">
          <h3 className="hotel-name">Debug Hotel</h3>
          <div className="hotel-details">
            <div className="hotel-details-column">
              <div className="hotel-detail-item"><div className="detail-label">Địa chỉ :</div><div className="detail-value">Vũng Tàu</div></div>
              <div className="hotel-detail-item"><div className="detail-label">Nhận phòng từ :</div><div className="detail-value">2:00 CH</div></div>
              <div className="hotel-detail-item"><div className="detail-label">Trả phòng trước :</div><div className="detail-value">12:00 CH</div></div>
              <div className="hotel-detail-item"><div className="detail-label">Liên hệ :</div><div className="detail-value">+84 1113060704</div></div>
            </div>
            <div className="hotel-details-column">
              <div className="hotel-detail-item"><div className="detail-label">Lễ tân : </div><div className="detail-value">Hoạt động 24/24</div></div>
            </div>
          </div>
        </div>
        <div className="booking-summary">
          {rooms.filter((room) => selectedRooms.includes(room.id)).map((room, index) => (
              <div className="room-summary" key={room.id}>
                <div className="room-summary-header">
                  <div className="room-summary-title">Phòng {index + 1}</div>
                  <div className="room-summary-price">{room.priceText}</div>
                </div>
                <div className="room-summary-details">
                  <div className="room-summary-description">
                    <div className="room-type">{room.title}</div>
                    <div className="room-capacity">{room.capacity}</div>
                    <div className="room-features">
                      {room.features.map((feature, idx) => (<div key={idx} className="room-feature"><span className="feature-icon">{feature.icon}</span><span>{feature.text}</span></div>))}
                    </div>
                  </div>
                  <div className="room-summary-amenities">
                    <div className="amenity-badge"><span className="amenity-icon">✓</span><span>Xuất sắc</span></div>
                    <div className="amenity-text">Bao gồm bữa sáng</div>
                  </div>
                </div>
              </div>
          ))}
          <div className="discount-row"><div className="discount-label">Tổng giảm giá được áp dụng</div><div className="discount-value">0 VND</div></div>
          <div className="total-row main-total"><div className="total-label">Tổng</div><div className="total-value">{calculateTotal()} VND</div></div>
          <div className="tax-rows">
            <div className="tax-row"><div className="tax-label">Bao gồm: Phí dịch vụ</div><div className="tax-value">0 VND</div></div>
            <div className="tax-row"><div className="tax-label">Bao gồm: Thuế VAT / Thuế tiêu thụ</div><div className="tax-value">0 VND</div></div>
          </div>
        </div>

        <div className="terms-conditions">
          <p className="terms-text">Tôi đồng ý với các điều khoản đặt phòng và chính sách của Debug Hotel. Khi nhấn nút Đặt ngay, tôi đồng ý với:</p>
          <div className="terms-checkbox">
            <input type="checkbox" id="termsAgree" />
            <label htmlFor="termsAgree">Tôi đã đọc các <a href="#" className="terms-link">điều khoản và điều kiện</a> và <a href="#" className="terms-link">chính sách bảo mật</a>, và tôi xác nhận đã hiểu và chấp nhận các điều khoản này.</label>
          </div>
        </div>
        <button className="book-now-button" onClick={handleBookNow} disabled={isBooking}>
          {isBooking ? 'ĐANG XỬ LÝ...' : 'ĐẶT NGAY'}
        </button>
        <p className="booking-disclaimer">Debug Hotel Rất thấp đỏ khi quý vị đặt phòng của quý vị. Để biết thêm thông tin về chính sách ý dịch vụ của nhà và để thực hiện các thay đổi cho việc đặt phòng của quý vị, vui lòng liên hệ trực tiếp với chúng tôi.</p>
      </div>
    );
  }

  function renderSidebar() {
    return (
      <div className="sidebar-card">
        <div className="sidebar-header">
          {currentStep === 1 ? `Chọn phòng (${selectedRooms.length})` : currentStep === 2 ? "Chọn dịch vụ thêm" : "Xác nhận đặt phòng"}
        </div>
        <div className="sidebar-content">
          <div className="total-row"><span>Tổng</span><span>{calculateTotal()} VND</span></div>
        </div>
        <button className="next-button" onClick={handleNextStep}>KẾ TIẾP</button>

      </div>
    );
  }

  return (
    <>
      <div className="booking-container">
        <HeaderBookingRoom 
          currentStep={currentStep} 
          onStepChange={setCurrentStep} 
          isCalendarOpen={isCalendarOpen} 
          setIsCalendarOpen={setIsCalendarOpen} 
        />
        <div className="booking-content">
          <div className="booking-main">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>
          {currentStep !== 3 && <div className="booking-sidebar">{renderSidebar()}</div>}
        </div>
      </div>
      <FooterUser />
      {isModalOpen && <Notification_BookingRoom onClose={() => {
          setIsModalOpen(false);
          setSelectedRooms([]);
          setSelectedServices([]);
          setCurrentStep(1);
          window.location.reload();
      }} />}
    </>
  );
}