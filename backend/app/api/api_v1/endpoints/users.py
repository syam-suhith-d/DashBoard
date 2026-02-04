from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas
from app.api import deps
from app.models import models
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
import shutil
import uuid
import os

router = APIRouter()

@router.get("/me", response_model=schemas.User)
def read_user_me(
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Get current user.
    """
    return current_user

@router.put("/me", response_model=schemas.User)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserUpdate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Update own user.
    """
    if user_in.email and user_in.email != current_user.email:
        # Check if email is available
        user = db.query(models.User).filter(models.User.email == user_in.email).first()
        if user:
            raise HTTPException(
                status_code=400,
                detail="This email is already registered",
            )

    user_data = user_in.model_dump(exclude_unset=True)
    for field, value in user_data.items():
        if field == "password":
            # Handle password update separately if needed, for now ignoring or hashing logic needed
            # Ideally use a separate change-password endpoint or hash here
            pass 
        else:
            setattr(current_user, field, value)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.post("/me/avatar", response_model=schemas.User)
def upload_avatar(
    *,
    db: Session = Depends(deps.get_db),
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """
    Upload user avatar.
    """
    allowed_extensions = {"jpg", "jpeg", "png", "gif"}
    file_ext = file.filename.split(".")[-1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid file type. Only jpg, jpeg, png, gif allowed.")
    
    # Generate unique filename
    file_name = f"{uuid.uuid4()}.{file_ext}"
    upload_dir = "static/uploads"
    file_path = os.path.join(upload_dir, file_name)
    
    # Save file
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Could not save file")
    
    # Update user avatar URL
    # Assuming backend runs on same host, construct relative or absolute URL
    # ideally base url should be from config
    avatar_url = f"http://127.0.0.1:8000/static/uploads/{file_name}"
    
    current_user.avatar = avatar_url
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    
    return current_user
