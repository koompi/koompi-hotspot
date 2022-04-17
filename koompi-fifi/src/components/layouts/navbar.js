import React from "react";
import { Layout, Popover } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

function TopNavbar() {
  const content = (
    <div>
      <Link to="/user/settings">Settings</Link>
      <p>
        <a href="/logout">Logout</a>
      </p>
    </div>
  );

  // const DisplayUser = () => {
  // const { error, loading, data } = useQuery(GET_USER, {
  //   variables: { email },
  // })
  // if (error) console.log(error)
  // if (loading) return "Loading ...";
  //   if (data) {
  //       const { fullname, avatar, email } = data.user
  //     return (
  //       <Popover
  //         placement="bottomRight"
  //         title={
  //           <div>
  //             <div>
  //               <b>Hello</b>
  //             </div>
  //             <p>hello@gmail.com</p>
  //           </div>
  //         }
  //         content={content}
  //       >
  //         <img
  //           src={`https://backend.koompi.com` + avatar}
  //           alt={fullname}
  //           className="avatar"
  //         />
  //       </Popover>
  //     );
  //   }
  // };

  return (
    <React.Fragment>
      <Header style={{ background: "#fff", padding: 0 }}>
        <Popover
          placement="bottomRight"
          title={
            <div>
              <div>
                <b>Hello</b>
              </div>
              <p>hello@gmail.com</p>
            </div>
          }
          content={content}
        >
          <img
            src={`https://backend.koompi.com`}
            alt="hello"
            className="avatar"
          />
        </Popover>
      </Header>
    </React.Fragment>
  );
}

export default TopNavbar;
