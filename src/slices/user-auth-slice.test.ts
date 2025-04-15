import { userAuthSlice, initialState } from './user-auth-slice';
import {
  registerAsync,
  loginAsync,
  forgotPasswordAsync,
  resetPasswordAsync,
  fetchUserAsync,
  updateUserAsync,
  logoutAsync,
  init
} from './user-auth-slice';
import { RootState } from '../services/store';
import {
  getUser,
  getUserError,
  isLoggedIn,
  isUserLoading
} from './user-auth-slice';

const mockAuthResponse = {
  success: true,
  user: {
    name: 'Test',
    email: 'test@test.com'
  },
  accessToken: 'test-access-token',
  refreshToken: 'test-refresh-token'
};

const mockUserResponse = {
  success: true,
  user: {
    name: 'Test',
    email: 'test@test.com'
  }
};

describe('userAuthSlice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(userAuthSlice.reducer(undefined, { type: '' })).toEqual(
      initialState
    );
  });

  describe('действие init', () => {
    it('должен устанавливать isInitialized в true', () => {
      const state = userAuthSlice.reducer(initialState, init());
      expect(state.isInitialized).toBe(true);
    });
  });

  describe('registerAsync', () => {
    const registerData = {
      email: 'test@test.com',
      name: 'Test',
      password: 'password'
    };

    it('должен обрабатывать pending состояние', () => {
      const state = userAuthSlice.reducer(
        initialState,
        registerAsync.pending('requestId', registerData)
      );
      expect(state.isFetching).toBe(true);
      expect(state.errorMessage).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние при успешной регистрации', () => {
      const state = userAuthSlice.reducer(
        initialState,
        registerAsync.fulfilled(mockAuthResponse, 'requestId', registerData)
      );
      expect(state.isFetching).toBe(false);
      expect(state.user).toEqual(mockAuthResponse.user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('должен обрабатывать rejected состояние', () => {
      const error = new Error('Registration failed');
      const state = userAuthSlice.reducer(
        initialState,
        registerAsync.rejected(error, 'requestId', registerData)
      );
      expect(state.isFetching).toBe(false);
      expect(state.errorMessage).toBe('Registration failed');
    });
  });

  describe('loginAsync', () => {
    const loginData = { email: 'test@test.com', password: 'password' };

    it('должен обрабатывать pending состояние', () => {
      const state = userAuthSlice.reducer(
        initialState,
        loginAsync.pending('requestId', loginData)
      );
      expect(state.isFetching).toBe(true);
      expect(state.errorMessage).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние при успешном входе', () => {
      const state = userAuthSlice.reducer(
        initialState,
        loginAsync.fulfilled(mockAuthResponse, 'requestId', loginData)
      );
      expect(state.isFetching).toBe(false);
      expect(state.user).toEqual(mockAuthResponse.user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('должен обрабатывать rejected состояние', () => {
      const error = new Error('Login failed');
      const state = userAuthSlice.reducer(
        initialState,
        loginAsync.rejected(error, 'requestId', loginData)
      );
      expect(state.isFetching).toBe(false);
      expect(state.errorMessage).toBe('Login failed');
    });
  });

  describe('fetchUserAsync', () => {
    it('должен обрабатывать pending состояние', () => {
      const state = userAuthSlice.reducer(
        initialState,
        fetchUserAsync.pending('requestId')
      );
      expect(state.isFetching).toBe(true);
      expect(state.errorMessage).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние при успешном получении пользователя', () => {
      const state = userAuthSlice.reducer(
        initialState,
        fetchUserAsync.fulfilled(mockUserResponse, 'requestId')
      );
      expect(state.isFetching).toBe(false);
      expect(state.user).toEqual(mockUserResponse.user);
      expect(state.isAuthenticated).toBe(true);
    });

    it('должен обрабатывать rejected состояние', () => {
      const error = new Error('Fetch user failed');
      const state = userAuthSlice.reducer(
        initialState,
        fetchUserAsync.rejected(error, 'requestId')
      );
      expect(state.isFetching).toBe(false);
      expect(state.errorMessage).toBe('Fetch user failed');
    });
  });

  describe('updateUserAsync', () => {
    const updateData = { name: 'Updated', email: 'updated@test.com' };
    const mockUpdatedUser = {
      success: true,
      user: {
        name: 'Updated',
        email: 'updated@test.com'
      }
    };

    it('должен обрабатывать fulfilled состояние при успешном обновлении', () => {
      const state = userAuthSlice.reducer(
        initialState,
        updateUserAsync.fulfilled(mockUpdatedUser, 'requestId', updateData)
      );
      expect(state.user).toEqual(mockUpdatedUser.user);
      expect(state.errorMessage).toBeNull();
    });

    it('должен обрабатывать rejected состояние', () => {
      const error = new Error('Update failed');
      const state = userAuthSlice.reducer(
        initialState,
        updateUserAsync.rejected(error, 'requestId', updateData)
      );
      expect(state.errorMessage).toBe('Update failed');
    });
  });

  describe('forgotPasswordAsync', () => {
    const forgotData = { email: 'test@test.com' };

    it('должен обрабатывать pending состояние', () => {
      const state = userAuthSlice.reducer(
        initialState,
        forgotPasswordAsync.pending('requestId', forgotData)
      );
      expect(state.isFetching).toBe(true);
      expect(state.errorMessage).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const state = userAuthSlice.reducer(
        initialState,
        forgotPasswordAsync.fulfilled(
          { success: true },
          'requestId',
          forgotData
        )
      );
      expect(state.isFetching).toBe(false);
      expect(state.errorMessage).toBeNull();
    });

    it('должен обрабатывать rejected состояние', () => {
      const error = new Error('Forgot password failed');
      const state = userAuthSlice.reducer(
        initialState,
        forgotPasswordAsync.rejected(error, 'requestId', forgotData)
      );
      expect(state.isFetching).toBe(false);
      expect(state.errorMessage).toBe('Forgot password failed');
    });
  });

  describe('resetPasswordAsync', () => {
    const resetData = { password: 'new', token: 'token' };

    it('должен обрабатывать pending состояние', () => {
      const state = userAuthSlice.reducer(
        initialState,
        resetPasswordAsync.pending('requestId', resetData)
      );
      expect(state.isFetching).toBe(true);
      expect(state.errorMessage).toBeNull();
    });

    it('должен обрабатывать fulfilled состояние', () => {
      const state = userAuthSlice.reducer(
        initialState,
        resetPasswordAsync.fulfilled({ success: true }, 'requestId', resetData)
      );
      expect(state.isFetching).toBe(false);
      expect(state.errorMessage).toBeNull();
    });

    it('должен обрабатывать rejected состояние', () => {
      const error = new Error('Reset password failed');
      const state = userAuthSlice.reducer(
        initialState,
        resetPasswordAsync.rejected(error, 'requestId', resetData)
      );
      expect(state.isFetching).toBe(false);
      expect(state.errorMessage).toBe('Reset password failed');
    });
  });

  describe('logoutAsync', () => {
    it('должен обрабатывать fulfilled состояние', () => {
      const stateWithUser = {
        ...initialState,
        user: { name: 'Test', email: 'test@test.com' },
        isAuthenticated: true
      };
      const state = userAuthSlice.reducer(
        stateWithUser,
        logoutAsync.fulfilled({ success: true }, 'requestId')
      );
      expect(state.user).toBeNull();
      expect(state.errorMessage).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('селекторы', () => {
    const mockState: RootState = {
      user: {
        isInitialized: true,
        isFetching: false,
        user: { name: 'Test', email: 'test@test.com' },
        errorMessage: null,
        isAuthenticated: true
      }
    } as RootState;

    it('должен выбирать пользователя', () => {
      expect(getUser(mockState)).toEqual(mockState.user.user);
    });

    it('должен выбирать сообщение об ошибке', () => {
      expect(getUserError(mockState)).toBeNull();
    });

    it('должен выбирать статус загрузки', () => {
      expect(isUserLoading(mockState)).toBe(false);
    });

    it('должен выбирать статус аутентификации', () => {
      expect(isLoggedIn(mockState)).toBe(true);
    });
  });
});
