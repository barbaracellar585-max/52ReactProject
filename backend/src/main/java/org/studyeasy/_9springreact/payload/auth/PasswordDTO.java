package org.studyeasy._9springreact.payload.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordDTO {

    @Size(min = 6, max = 20)
    @Schema(description = "Password", example = "password",
    requiredMode = Schema.RequiredMode.REQUIRED, maxLength = 20, minLength = 6)
    private String password;
}
