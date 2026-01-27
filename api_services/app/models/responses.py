from typing import TypeVar, Generic, Optional
from pydantic import BaseModel

T = TypeVar('T')

class ApiResponse(BaseModel, Generic[T]):
    """Unified API response format."""
    status_code: int
    message: str
    data: Optional[T] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "status_code": 200,
                "message": "Success",
                "data": {"key": "value"}
            }
        }

def success_response(data: T, message: str = "Success") -> ApiResponse[T]:
    """Create a successful response."""
    return ApiResponse(
        status_code=200,
        message=message,
        data=data
    )

def error_response(status_code: int, message: str) -> ApiResponse:
    """Create an error response."""
    return ApiResponse(
        status_code=status_code,
        message=message,
        data=None
    )
