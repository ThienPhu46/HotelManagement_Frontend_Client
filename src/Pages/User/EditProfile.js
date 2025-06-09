import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate để điều hướng
import FooterUser from "../../Components/User/Components_Js/FooterUser"
import "../../Design_Css/User/EditProfile.css"
import HeaderUserLogin from "../../Components/User/Components_Js/HeaderUserLogin"

function EditProfile() {
  const [activeTab, setActiveTab] = useState("hoat-dong")
  const [activeMenuItem, setActiveMenuItem] = useState("")
  const [showPopup, setShowPopup] = useState(false)

  // 2. Tạo state để lưu thông tin người dùng
  const [displayName, setDisplayName] = useState("");
  const [userPoints, setUserPoints] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Set active menu item based on hash when component mounts
    const hash = window.location.hash.replace("#", "")
    if (hash) {
      setActiveMenuItem(hash)
    } else {
      setActiveMenuItem("points") // Default active menu item
    }

    // 3. Lấy dữ liệu người dùng từ localStorage
    const userDataString = localStorage.getItem('currentUser');
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      // Cập nhật state với Tên hiển thị và Điểm
      // Giả sử object user có thuộc tính 'tenHienThi'
      setDisplayName(userData.tenHienThi || 'Tài khoản'); 
      
      // Lưu ý: Điểm của người dùng cũng cần được trả về từ API và lưu vào localStorage
      // Tạm thời vẫn dùng giá trị cứng nếu chưa có, bạn có thể thay '9999' bằng userData.points
      setUserPoints(9999); 
    }

  }, [])

  // 4. Thêm hàm xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/'); // Chuyển về trang chủ
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab)
  }

  const handleMenuItemClick = (item) => {
    // Ngăn chặn hành vi mặc định nếu là nút đăng xuất
    if (item === 'logout') {
      handleLogout();
      return;
    }
    setActiveMenuItem(item)
    window.location.hash = item
  }

  const handlePopupToggle = () => {
    setShowPopup(!showPopup)
  }

  return (
    <>
      <HeaderUserLogin />

      <div className="dashboard-container">
        {/* Left Container - Profile Section */}
        <div className="left-container">
          <div className="profile-popup">
            <div className="profile-header">
              {/* 5. Hiển thị tên động */}
              <span className="profile-name">{displayName}</span>
              <div className="membership-status">
                <img src="/Img_User/CoinUser.png" alt="Gold Member" className="gold-icon" />
                <span>Bạn là thành viên Gold của Debug Hotel</span>
              </div>
            </div>
            <div className="profile-menu-items">
              <a href="EditProfile">
              <div
                className={`profile-menu-item ${activeMenuItem === "points" ? "active-menu-item" : ""}`}
                onClick={() => handleMenuItemClick("points")}
              >
                <img src="/Img_User/$.svg" alt="Points" className="menu-icon" />
                {/* 5. Hiển thị điểm động */}
                <span>{userPoints} Điểm</span>
              </div>
              </a>
              <a href="EditProFilePage">
              <div
                className={`profile-menu-item ${activeMenuItem === "edit-profile" ? "active-menu-item" : ""}`}
                onClick={() => handleMenuItemClick("edit-profile")}
              >
                <img src="/Img_User/user.svg" alt="Edit Profile" className="menu-icon" />
                <span>Chỉnh sửa hồ sơ</span>
              </div>
              </a>
              <a href="TransactionHistory">
              <div
                className={`profile-menu-item ${activeMenuItem === "history" ? "active-menu-item" : ""}`}
                onClick={() => handleMenuItemClick("history")}
              >
                <img src="/Img_User/Lich.svg" alt="Transaction History" className="menu-icon" />
                <span>Lịch sử giao dịch</span>
              </div>
              </a>
              {/* Sửa lại link Đăng xuất để gọi hàm handleLogout */}
              <div
                className={`profile-menu-item ${activeMenuItem === "logout" ? "active-menu-item" : ""}`}
                onClick={() => handleMenuItemClick("logout")}
                style={{ cursor: 'pointer' }}
              >
                <img src="/Img_User/logout.svg" alt="Logout" className="menu-icon" />
                <span>Đăng xuất</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Container */}
        <div className="right-container">
          {/* Header */}
          <h1 className="rewards-title">Điểm thưởng của tôi</h1>

          {/* Info Cards */}
          <div className="info-cards">
            {/* Card 1 */}
            <div className="info-card">
              <div className="info-card-content">
                <h3 className="card-title">Thông tin về xu</h3>
                <div className="points-display">
                  <div className="coin-icon">
                    <span>G</span>
                  </div>
                   {/* 5. Hiển thị điểm động */}
                  <span className="points-value">{userPoints} Điểm</span>
                </div>
                <button className="card-button" onClick={handlePopupToggle}>Thông tin về xu</button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="info-card">
              <div className="info-card-content">
                <h3 className="card-title">Tìm hiểu thêm về xu</h3>
                <p className="card-description">Hãy tìm hiểu về cách kiếm và đổi Xu!</p>
                <button className="card-button" onClick={handlePopupToggle}>Tìm hiểu cách thức</button>
              </div>
            </div>
          </div>

          {/* Popup và các phần còn lại giữ nguyên */}
          {showPopup && (
            <div className="popup-overlay">
              <div className="popup-content">
                <button className="popup-close-button" onClick={handlePopupToggle}>✖</button>
                <h2 className="popup-title">Thông tin về Debug Points</h2>
                <div className="popup-image">
                  <img src="/Img_User/Coin_info.png" alt="Wallet with Coins" />
                </div>
                <div className="popup-text">
                  <h3 className="popup-subtitle">Debug Points là gì?</h3>
                  <p className="popup-description">
                    Debug Points được sử dụng như Xu thưởng, là cách chúng tôi tri ân nguồn đóng góp đặc biệt và tham gia hoạt động của Debug hotel.
                  </p>
                  <ul className="popup-list">
                    <li>
                      <img src="/Img_User/Coin_info1.png" alt="Discount Icon" className="list-icon" />
                      <span>Dùng Traveloka Points để nhận giảm giá trực tiếp cho đặt chỗ của bạn</span>
                    </li>
                    <li>
                      <img src="/Img_User/Coin_info2.png" alt="Coin Icon" className="list-icon" />
                      <span>1 Debug Points = VND/0,01</span>
                    </li>
                    <li>
                      <img src="/Img_User/Coin_info3.png" alt="Calendar Icon" className="list-icon" />
                      <span>Traveloka Points có thể hoàn sử dụng 1 năm</span>
                    </li>
                    <li>
                      <img src="/Img_User/Coin_info4.png" alt="Priority Icon" className="list-icon" />
                      <span>Việc sử dụng Traveloka Points sẽ không ảnh hưởng đến quy trình Traveloka Priority của bạn</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Transaction History Section */}
          <div className="history-section">
            <h2 className="history-title">Lịch sử tích Xu</h2>

            {/* Tabs */}
            <div className="tabs-container">
              <div className="tabs-list">
                <button
                  className={`tab-button ${activeTab === "hoat-dong" ? "active" : ""}`}
                  onClick={() => handleTabClick("hoat-dong")}
                >
                  Hoạt động
                </button>
                <button
                  className={`tab-button ${activeTab === "dang-cho-xu-ly" ? "active" : ""}`}
                  onClick={() => handleTabClick("dang-cho-xu-ly")}
                >
                  Đang chờ xử lý
                </button>
                <button
                  className={`tab-button ${activeTab === "da-het-han" ? "active" : ""}`}
                  onClick={() => handleTabClick("da-het-han")}
                >
                  Đã hết hạn
                </button>
                <button
                  className={`tab-button ${activeTab === "da-huy" ? "active" : ""}`}
                  onClick={() => handleTabClick("da-huy")}
                >
                  Đã hủy
                </button>
              </div>

              <div className="tab-content">
                {activeTab === "hoat-dong" && (
                  <div className="tab-panel">
                    <div className="empty-state">
                      <div className="illustration-container">
                        <div className="point-icon">
                          <span>P</span>
                        </div>
                        <div className="illustration">
                          <div className="sparkle"></div>
                          <img
                            src="/Img_User/Coin_editprofile.png"
                            alt="Empty state illustration"
                            className="illustration-image"
                          />
                        </div>
                      </div>
                      <p className="empty-description">
                        Bạn hiện chưa có Debug Points nào.
                        <br />
                        Hãy cùng khám phá nhiều cách khác nhau để kiếm Xu và tận hưởng những lợi ích!
                      </p>
                      <button className="learn-button">Tìm hiểu cách thức</button>
                    </div>
                  </div>
                )}

                {activeTab === "dang-cho-xu-ly" && (
                  <div className="tab-panel">
                    <div className="empty-state">
                      <div className="illustration-container">
                        <div className="point-icon">
                          <span>P</span>
                        </div>
                        <div className="illustration">
                          <div className="sparkle"></div>
                          <img
                            src="/Img_User/Coin_editprofile.png"
                            alt="Empty state illustration"
                            className="illustration-image"
                          />
                        </div>
                      </div>
                      <p className="empty-description">
                        Bạn hiện không có hoạt động Traveloka Points nào tại đây.
                        <br />
                        Kiểm tra các tab khác để xem tình trạng Xu của bạn!
                      </p>
                      <button className="learn-button">Tìm hiểu cách thức</button>
                    </div>
                  </div>
                )}

                {activeTab === "da-het-han" && (
                  <div className="tab-panel">
                    <div className="empty-state">
                      <div className="illustration-container">
                        <div className="point-icon">
                          <span>P</span>
                        </div>
                        <div className="illustration">
                          <div className="sparkle"></div>
                          <img
                            src="/Img_User/Coin_editprofile.png"
                            alt="Empty state illustration"
                            className="illustration-image"
                          />
                        </div>
                      </div>
                      <p className="empty-description">
                        Bạn hiện không có hoạt động Traveloka Points nào tại đây.
                        <br />
                        Kiểm tra các tab khác để xem tình trạng Xu của bạn!
                      </p>
                      <button className="learn-button">Tìm hiểu cách thức</button>
                    </div>
                  </div>
                )}

                {activeTab === "da-huy" && (
                  <div className="tab-panel">
                    <div className="empty-state">
                      <div className="illustration-container">
                        <div className="point-icon">
                          <span>P</span>
                        </div>
                        <div className="illustration">
                          <div className="sparkle"></div>
                          <img
                            src="/Img_User/Coin_editprofile.png"
                            alt="Empty state illustration"
                            className="illustration-image"
                          />
                        </div>
                      </div>
                      <p className="empty-description">
                        Bạn hiện không có hoạt động Traveloka Points nào tại đây. <br />
                        Kiểm tra các tab khác để xem tình trạng Xu của bạn!
                      </p>
                      <button className="learn-button">Tìm hiểu cách thức</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterUser />
    </>
  )
}

export default EditProfile