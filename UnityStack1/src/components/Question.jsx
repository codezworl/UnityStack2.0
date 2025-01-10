import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";

const DiscussionForum = () => {
  return (
    <div className="container-fluid mt-4 pb-5">
      {/* Filter Section */}
      <Container fluid>
        <Row className="mb-3">
          <Col xs={12} className="d-flex flex-wrap gap-2 justify-content-between">
            <Button variant="primary" className="flex-grow-1">
              Ask Question
            </Button>
            <Button variant="outline-secondary" className="flex-grow-1">
              Newest
            </Button>
            <Button variant="outline-secondary" className="flex-grow-1">
              Active
            </Button>
            <Button variant="outline-secondary" className="flex-grow-1">
              Unanswered
            </Button>
            <Button variant="outline-secondary" className="flex-grow-1">
              More
            </Button>
            <Button variant="primary" className="flex-grow-1">
              Filter
            </Button>
          </Col>
        </Row>
      </Container>

      {/* Questions Section */}
      <div className="d-flex justify-content-center mb-5">
        <div className="w-100" style={{ maxWidth: "800px" }}>
          <div className="card mb-4 p-3 shadow-sm">
            <Row>
              <Col xs={3} className="text-center">
                <p className="fw-bold text-muted mb-1">0 votes</p>
                <p className="text-success fw-bold mb-1">1 answer</p>
                <p className="text-muted">13 views</p>
              </Col>
              <Col>
                <h5 className="text-primary mb-2">
                  Error print user.default swift 3
                </h5>
                <div className="d-flex gap-2 mb-2">
                  <span className="badge bg-secondary">ios</span>
                  <span className="badge bg-secondary">swift</span>
                </div>
                <p className="text-muted mb-2">Andy Obusek modified 21 mins ago</p>
                <p>
                  <span className="fw-bold">Owens</span> answered 4 mins ago: You are the operator of a junction and
                  you hear a Git branch coming...
                </p>
                <a href="#" className="text-primary">
                  View full answer
                </a>
              </Col>
            </Row>
          </div>

          <div className="card mb-4 p-3 shadow-sm">
            <Row>
              <Col xs={3} className="text-center">
                <p className="fw-bold text-muted mb-1">7 votes</p>
                <p className="text-success fw-bold mb-1">1 answer</p>
                <p className="text-muted">300 views</p>
              </Col>
              <Col>
                <h5 className="text-primary mb-2">
                  Custom UIView intrinsicContentSize width...
                </h5>
                <div className="d-flex gap-2 mb-2">
                  <span className="badge bg-secondary">ios</span>
                  <span className="badge bg-secondary">uiview</span>
                  <span className="badge bg-secondary">interface-builder</span>
                </div>
                <p className="text-muted mb-2">Natikibaba answered 4 mins ago</p>
                <p>
                  <span className="fw-bold">Jonathan Araujo</span> answered 4 mins ago: AutoLayout is definitely
                  closer to supporting Xcode 12...
                </p>
                <a href="#" className="text-primary">
                  View full answer
                </a>
              </Col>
            </Row>
          </div>

          {/* Additional Questions */}
          <div className="card mb-4 p-3 shadow-sm">
            <Row>
              <Col xs={3} className="text-center">
                <p className="fw-bold text-muted mb-1">65 votes</p>
                <p className="text-success fw-bold mb-1">9 answers</p>
                <p className="text-muted">38k views</p>
              </Col>
              <Col>
                <h5 className="text-primary mb-2">
                  Update Firebase local data with observeSingleEvent
                </h5>
                <div className="d-flex gap-2 mb-2">
                  <span className="badge bg-secondary">ios</span>
                  <span className="badge bg-secondary">firebase</span>
                </div>
                <p className="text-muted mb-2">Kevin Mortimer answered 4 mins ago</p>
                <p>
                  Firebase only provides ephemeral storage. Running a Database on Fargate is a no-go...
                </p>
                <a href="#" className="text-primary">
                  View full answer
                </a>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionForum;
