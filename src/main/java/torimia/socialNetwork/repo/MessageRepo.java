package torimia.socialNetwork.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import torimia.socialNetwork.domain.Message;

public interface MessageRepo extends JpaRepository<Message,Long> {
}
