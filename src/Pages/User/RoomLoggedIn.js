import { useState } from "react";
import "../../Design_Css/User/RoomLoggedIn.css";
import HeaderUserLogin from "../../Components/User/Components_Js/HeaderUserLogin";
import FooterUser from "../../Components/User/Components_Js/FooterUser";


const RoomLoggedIn = () => {
return (
<>
      <HeaderUserLogin />
    
    <div className="single-room-container-roomloggedin">
              <section className="section">
        <h1 className="section-title">PHÒNG NGỦ</h1>
        <p>
          Khách sạn Debug có 36 phòng ngủ hạng tiêu chuẩn và cao cấp, tạo sự cân bằng bởi việc kết hợp giữa tính chất hiện đại và truyền thống, cung cấp các dịch vụ đặc biệt và sang trọng. Tất cả các phòng đều được bày trí khác nhau trong tiêu chuẩn của từng hạng phòng, phong cách và kích thước phòng, được trang trí trang nhã để tạo cho mỗi phòng một cá tính riêng.
        </p>
        <div className="underline_room"></div>
      </section>
      <div className="room-content">
        <div className="room-image">
          <img src="./Img_User/Img_Room_1.png" alt="Single Room" />
        </div>
        <div className="room-details">
          <h2 className="section-title-room">PHÒNG ĐƠN (SINGLE ROOM)</h2>
          <ul className="details-list">
            <li>Mã phòng: P101 – P112</li>
            <li>Sức chứa: 1 người</li>
            <li>Diện tích: 18–22m²</li>
            <li>Trang bị: Giường đơn cao cấp, TV, minibar, bàn làm việc, máy lạnh, wifi tốc độ cao</li>
            <li>Phù hợp: Khách đi công tác, du lịch cá nhân</li>
          </ul>
          <p className="quote-room">
            “Không gian nhỏ gọn, yên tĩnh và đầy đủ tiện nghi dành cho những ai cần sự riêng tư tuyệt đối.”
          </p>
        </div>
      </div>
            <div className="room-content">
        <div className="room-image">
          <img src="./Img_User/Img_Room_3.png" alt="Single Room" />
        </div>
        <div className="room-details">
          <h2 className="section-title-room">Phòng Đôi (Double Room)</h2>
          <ul className="details-list">
            <li>Mã phòng: P201 – P210</li>
            <li>Sức chứa: 2 người</li>
            <li>Diện tích: 24–30m²</li>
            <li>Trang bị: Giường đôi / 2 giường đơn, bàn làm việc, TV màn hình phẳng, tủ lạnh mini, máy lạnh</li>
            <li>Phù hợp: Cặp đôi, bạn bè, khách lưu trú dài ngày</li>
          </ul>
          <p className="quote-room">
            “Không gian thoáng đãng cho hai người với đầy đủ tiện ích giúp kỳ nghỉ thêm thoải mái.”
          </p>
        </div>
      </div>
            <div className="room-content">
        <div className="room-image">
          <img src="./Img_User/Img_Room_2.png" alt="Single Room" />
        </div>
        <div className="room-details">
          <h2 className="section-title-room">Phòng Gia Đình (Family Room)</h2>
          <ul className="details-list">
            <li>Mã phòng: P301 – P304</li>
            <li>Sức chứa: 3–4 người</li>
            <li>Diện tích: 35–40m²</li>
            <li>Trang bị: 1 giường đôi + 1 giường đơn, sofa, bàn ăn nhỏ, tủ đồ lớn, nhà tắm riêng rộng rãi</li>
            <li>Phù hợp: Gia đình có trẻ em, nhóm bạn</li>
          </ul>
          <p className="quote-room">
            “Căn phòng rộng rãi, ấm cúng dành cho những giây phút sum vầy bên người thân yêu.”
          </p>
        </div>
      </div>
    </div>
    <FooterUser />
      
</>
  );
};

export default RoomLoggedIn;