from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import time


class HealthStatus(BaseModel):
    status: str
    timestamp: str
    uptime: float
    details: Optional[dict] = None


def get_health_status():
    """Generate health status with uptime and timestamp"""
    start_time = getattr(get_health_status, '_start_time', None)
    if start_time is None:
        start_time = time.time()
        get_health_status._start_time = start_time
    
    uptime = time.time() - start_time
    
    return HealthStatus(
        status="healthy",
        timestamp=datetime.now().isoformat(),
        uptime=round(uptime, 2),
        details={
            "database_connected": True,  # This would be checked in real implementation
            "api_keys_loaded": True     # This would be checked in real implementation
        }
    )