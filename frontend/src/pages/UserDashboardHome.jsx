import { useUserAuth } from "../context/UserAuthContext";

const UserDashboardHome = () => {
  const { user, wishlist, cart } = useUserAuth();

  return (
    <div>
      <div className="bg-white rounded-[28px] border border-[#eadccb] p-8">
        <h1 className="text-4xl font-black text-[#1f120c]">
          Welcome Back, {user?.name}
        </h1>

        <p className="text-[#7b5b46] mt-3">
          Manage your profile, orders, wishlist and returns from one place.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white border border-[#eadccb] rounded-[24px] p-6">
          <p className="text-[#7b5b46]">
            Wishlist Items
          </p>

          <h3 className="text-4xl font-black mt-3">
            {wishlist.length}
          </h3>
        </div>

        <div className="bg-white border border-[#eadccb] rounded-[24px] p-6">
          <p className="text-[#7b5b46]">
            Cart Items
          </p>

          <h3 className="text-4xl font-black mt-3">
            {cart.length}
          </h3>
        </div>

        <div className="bg-white border border-[#eadccb] rounded-[24px] p-6">
          <p className="text-[#7b5b46]">
            Account Status
          </p>

          <h3 className="text-2xl font-black mt-3 text-[#155b37]">
            Active
          </h3>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardHome;