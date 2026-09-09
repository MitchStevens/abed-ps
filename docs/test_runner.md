
```mermaid
flowchart TD
  not_started((Not Started))

  check_for_port_mismatch
  check_for_failed_restriction
  convert_to_evaluable

  ready_for_testing

  level_complete((Level Complete))


  not_started --- check_for_port_mismatch
  check_for_port_mismatch --- check_for_failed_restriction
  check_for_failed_restriction --- convert_to_evaluable
  convert_to_evaluable --- ready_for_testing
  ready_for_testing --- run_all_tests


  subgraph test_runner
    run_all_tests
    run_single_test
    single_test_failed
    move_to_next_test

    run_all_tests -- test n failed --> single_test_failed
    single_test_failed --> run_single_test
    run_single_test -- Test n failed --> single_test_failed
    run_single_test -- Test n succeeded --> move_to_next_test
    move_to_next_test --  Start test (n+1) --> run_single_test
    move_to_next_test -- no tests remaining --> run_all_tests



  end
  run_all_tests -- All tests succeeded --> level_complete
```

## Sequence diagram (golden path)

Component-level view of the same flow, from clicking "Start testing" to the "Back to level select" button appearing. Assumes every test case passes on the first try.

```mermaid
sequenceDiagram
    actor User
    participant Feedback
    participant Sidebar
    participant Level
    participant Board
    participant EvaluableBoard as EvaluableBoard<br/>(pure eval)

    User->>Feedback: click "Start testing" (RunAllTests)
    Feedback->>Feedback: reset all test cases to NotStarted<br/>currentIndex = 0

    loop for each test case (sequential)
        Feedback->>Feedback: runCurrentTest<br/>mark case InProgress, show card
        Feedback-->>Sidebar: Output: TestCaseData {inputs, expected}
        Sidebar-->>Level: forward output

        Level->>Board: request RunTestCase(inputs, expected)
        Board->>EvaluableBoard: EvaluateBoard(inputs)<br/>layer-by-layer combinational solve
        EvaluableBoard-->>Board: outputs (received)
        Board->>Board: compare received == expected

        Board-->>Level: TestCaseOutcome (Passed)
        Level->>Sidebar: tell TestCaseResponse(outcome)
        Sidebar->>Feedback: TestCaseOutcome(Passed)

        Feedback->>Feedback: wait resultHoldDelay (900ms)<br/>increment currentIndex
    end

    Feedback->>Feedback: currentIndex past last case<br/>raise AllTestsPassed
    Feedback-->>Sidebar: Output: AllTestsPassed
    Sidebar-->>Level: forward AllTestsPassed

    Level->>Level: saveLevelProgress(Completed)<br/>completionStatus = Completed
    Level->>Sidebar: completionStatus = Completed (props)
    Sidebar->>Feedback: completionStatus = Completed (props)
    Feedback->>Feedback: render "Back to level select" button<br/>+ "N/N tests passed" card

    User->>Feedback: click "Back to level select" (GoToLevelSelect)
    Feedback-->>Sidebar: Output: ReturnToLevelSelect
    Sidebar-->>Level: forward ReturnToLevelSelect
    Level->>Level: navigateTo LevelSelect<br/>(unmounts Level/Board/Sidebar/Feedback)
```