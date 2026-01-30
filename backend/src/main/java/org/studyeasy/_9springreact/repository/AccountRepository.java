package org.studyeasy._9springreact.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.studyeasy._9springreact.model.Account;

import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account,Long> {

    Optional<Account> findByEmail(String email);
}
