import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import { logoutUser, user } from '../utils/auth';
import { firstLetter } from '../utils/helper';

import './navbar.scss';

import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'reactstrap';

import BellIcon from '../../assets/icons/bell.svg';
import { getNotifications, markAllNotificationAsRead } from '../../store/user/userSlice';
import FormContainer from '../form-container/form-container';

const AdminNavBar = ({ toggleSidebar, isSidebarOpen }) => {
    // ---------- TESTING ----------
    // const [notificationList, setNotificationList] = useState({
    //     data: [
    //         {
    //             id: "fa66e795-bb54-4b4a-8502-4c3562d60951",
    //             data: {
    //                 title: "Hello World",
    //                 body:
    //                     "This will not get displayed any way. It is just a test."
    //             },
    //             read_at: "2021-08-25 13:13:16",
    //             created_at: "2021-08-25 13:13:16"
    //         },
    //         {
    //             id: "fa66e795-bb54-4b4a-8502-4c3562d6095a",
    //             data: {
    //                 title: "Hello World",
    //                 body:
    //                     "This will not get displayed any way. It is just a test."
    //             },
    //             read_at: null,
    //             created_at: "2021-08-25 13:13:16"
    //         },
    //         {
    //             id: "fa66e795-bb54-4b4a-8502-4c3562d6095c",
    //             data: {
    //                 title: "Hello World",
    //                 body:
    //                     "This will not get displayed any way. It is just a test."
    //             },
    //             read_at: null,
    //             created_at: "2021-08-25 13:13:16"
    //         }
    //     ]
    // });

    // const onMarkAllAsRead = () => {
    //     const newList = notificationList.data.map(item => {
    //         return {
    //             ...item,
    //             read_at: new Date().toISOString()
    //         };
    //     });

    //     setNotificationList({
    //         ...notificationList,
    //         data: newList
    //     });
    // };

    const [notificationModal, setNotificationModal] = useState(false);
    const [activeNotification, setActiveNotification] = useState({});
    const dispatch = useDispatch();
    const { notificationList } = useSelector((state) => state.userSlice);

    useEffect(() => {
        dispatch(getNotifications());
    }, [dispatch]);

    const onMarkAllAsRead = () => {
        dispatch(markAllNotificationAsRead());
    };

    const handleActiveNotification = (id) => {
        setActiveNotification(() => notificationList.data.find((notification) => notification.id === id));

        setNotificationModal(true);
    };

    return (
        <nav className="navbar admin_navbar navbar-expand-md fixed-top">
            <div className="container-fluid">
                <div className="navigation">
                    <img
                        className="menu"
                        alt="menu"
                        src={
                            isSidebarOpen
                                ? 'https://res.cloudinary.com/the-now-entity/image/upload/q_auto/v1609939220/Lendha/menu_3_ur6plq.svg'
                                : 'https://res.cloudinary.com/the-now-entity/image/upload/q_auto/v1611313856/Lendha/menu_2_5_upliq0.svg'
                        }
                        onClick={toggleSidebar}
                    />
                    <Link to="/">
                        <img
                            src="https://res.cloudinary.com/thelendha/image/upload/v1653493588/upload/lendha-logo_irbke4.png"
                            className="logo"
                            alt="Lendha Logo"
                        />
                    </Link>
                </div>

                <div className="d-flex">
                    <div className="nav-item dropdown signed_in_div">
                        <button
                            className="btn text-white mr-1 border-none shadow-none"
                            id="notification"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <img src={BellIcon} alt="notification" />
                        </button>
                        <div
                            className="dropdown-menu notification__wrapper"
                            aria-labelledby="notification"
                            style={{ minWidth: '25rem', padding: '1rem' }}
                        >
                            <div className="d-flex flex-column">
                                <div className="d-flex justify-content-between text-dark" style={{ fontWeight: 500 }}>
                                    <span>Notifications</span>
                                    {notificationList?.data?.length > 0 && (
                                        <span role="button" onClick={onMarkAllAsRead}>
                                            Mark all as read
                                        </span>
                                    )}
                                </div>
                                <hr />
                                <div className="notification__list">
                                    {notificationList?.data?.length > 0
                                        ? notificationList?.data.map((notification) => (
                                              <div
                                                  className={
                                                      'notification__item list' +
                                                      (notification?.read_at ? ' read' : ' unread')
                                                  }
                                                  key={notification.id}
                                              >
                                                  <span className="title">{notification?.data?.title}</span>
                                                  <div onClick={() => handleActiveNotification(notification?.id)}>
                                                      <p
                                                          dangerouslySetInnerHTML={{
                                                              __html: DOMPurify.sanitize(
                                                                  notification?.data?.body +
                                                                      '<a role="button"> View file</a>',
                                                              ),
                                                          }}
                                                      />
                                                      <span>{notification?.read_at}</span>
                                                  </div>
                                              </div>
                                          ))
                                        : 'No new notifications'}
                                </div>
                                <hr />
                                <div className="d-flex justify-content-end">
                                    {notificationList?.data?.length > 0 && (
                                        <a href="#view-all" className="text-dark">
                                            View all
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="nav-item dropdown signed_in_div">
                        <button
                            className="nav-link"
                            id="dropdown01"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <div className="username">
                                <p>{firstLetter(user.name)}</p>
                            </div>
                        </button>
                        <div className="dropdown-menu" aria-labelledby="dropdown01">
                            <hr />
                            <button className="dropdown-item" onClick={() => logoutUser()}>
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {notificationModal && (
                    <Modal isOpen={true}>
                        <FormContainer headText={activeNotification?.data?.title} rule>
                            <p>{activeNotification?.data?.body}</p>
                            <div className="actions">
                                <p className="btn_white_blue" onClick={() => setNotificationModal(false)}>
                                    Cancel
                                </p>
                            </div>
                        </FormContainer>
                    </Modal>
                )}
            </div>
        </nav>
    );
};

export default AdminNavBar;
