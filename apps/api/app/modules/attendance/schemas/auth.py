from pydantic import BaseModel


class UserRegisterRequest(BaseModel):
    name: str
    email: str
    password: str


class UserLoginRequest(BaseModel):
    email: str
    password: str


class UserForgotPasswordRequest(BaseModel):
    email: str
    new_password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    message: str
    user: UserResponse
