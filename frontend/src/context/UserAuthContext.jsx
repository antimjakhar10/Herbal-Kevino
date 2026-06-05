import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../utils/api";

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("userToken") || "");

  const [wishlist, setWishlist] = useState([]);

  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeUser = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        const savedUser = localStorage.getItem("userData");

        if (savedUser && token) {
          const parsedUser = JSON.parse(savedUser);

          setUser(parsedUser);

          api.defaults.headers.common.Authorization = `Bearer ${token}`;

          const [wishlistRes, cartRes] = await Promise.all([
            api.get("/users/wishlist"),
            api.get("/users/cart"),
          ]);

          setWishlist(wishlistRes.data.wishlist || []);

          setCart(cartRes.data.cart || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, [token]);

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);

    localStorage.setItem("userToken", data.token);
    localStorage.setItem("userData", JSON.stringify(data.user));

    api.defaults.headers.common.Authorization = `Bearer ${data.token}`;

    setToken(data.token);
    setUser(data.user);

    return data;
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("userToken", data.token);
    localStorage.setItem("userData", JSON.stringify(data.user));

    api.defaults.headers.common.Authorization = `Bearer ${data.token}`;

    setToken(data.token);
    setUser(data.user);

    await fetchWishlist();
    await fetchCart();

    return data;
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");

    delete api.defaults.headers.common.Authorization;

    setUser(null);
    setToken("");
    setWishlist([]);
    setCart([]);
  };

  const fetchWishlist = async () => {
    try {
      const { data } = await api.get("/users/wishlist");
      setWishlist(data.wishlist || []);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) {
      return {
        success: false,
        authRequired: true,
      };
    }

    const { data } = await api.post("/users/wishlist/toggle", {
      productId,
    });

    await fetchWishlist();

    return data;
  };

  const fetchCart = async () => {
    try {
      const { data } = await api.get("/users/cart");
      setCart(data.cart || []);
    } catch (error) {
      console.log(error);
    }
  };

  const addToCart = async (
    productId,
    quantity = 1,
    variant = "",
    price = 0,
    mrp = 0,
  ) => {
    if (!user) {
      return {
        success: false,
        authRequired: true,
      };
    }

    const { data } = await api.post("/users/cart/add", {
      productId,
      quantity,
      variant,
      price,
      mrp,
    });

    setCart(data.cart || []);

    return data;
  };

  const removeFromCart = async (productId, variant) => {
    const { data } = await api.delete("/users/cart/remove", {
      data: {
        productId,
        variant,
      },
    });

    setCart(data.cart || []);
  };

  const updateCartQuantity = async (productId, quantity, variant) => {
    const { data } = await api.put("/users/cart/update", {
      productId,
      quantity,
      variant,
    });

    setCart(data.cart || []);
  };

  const clearCart = async () => {
    try {
      const { data } = await api.delete("/users/cart/clear");

      setCart(data.cart || []);

      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserData = (updatedUser) => {
    setUser(updatedUser);

    localStorage.setItem("userData", JSON.stringify(updatedUser));
  };

  return (
    <UserAuthContext.Provider
      value={{
        user,
        token,
        loading,
        wishlist,
        cart,
        register,
        login,
        logout,
        fetchWishlist,
        toggleWishlist,
        fetchCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateUserData,
        clearCart,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => useContext(UserAuthContext);
