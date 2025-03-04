let SWAP_WAY = 1; // 1: from bnb to xtime; 2: from xtime to bnb
let DEADLINE_TIME = 20 * 60;
let SLIPPAGE = 50;
let SWAP_FROM_VALUE = 0;
let SWAP_TO_VALUE = 0;
let BNB_BALANCE = 0;
let LIQUIDITY_BALANCE = "0";
let LIQUIDITY_TOTAL = 0;
let PAIR_RESERVES;
let XTIME_BALANCE = 0;
let CURRENT_ADDRESS;
let POLL_AMOUNT_XTIME = 0;
let POLL_AMOUNT_BNB = 0;
let REMOVE_LIQUIDITY_PERCENT = 0;

let PAIR_TOKEN_ALLOWANCE = 0;
let STAKE_TOTAL = "0";
let STAKE_BALANCE = "0";
let STAKE_CHANGE_WAY = 1; // 1: increase; 2: reduce
let STAKE_CHANGE_VALUE = 0;

let XTIME_STAKE_ALLOWANCE = "0";
let XTIME_STAKE_CHANGE_VALUE = 0;
let XTIME_STAKE_BALANCE = "0";
let XTIME_STAKE_TOTAL = "0";

let NEW_XTIME_STAKE_ALLOWANCE = "0";
let NEW_XTIME_STAKE_BALANCE = "0";
let NEW_XTIME_STAKE_CHANGE_VALUE = 0;
let NEW_XTIME_STAKE_TOTAL = "0";

let SUPER_XTIME_STAKE_ALLOWANCE = "0";
let SUPER_XTIME_STAKE_BALANCE = "0";
let SUPER_XTIME_STAKE_CHANGE_VALUE = 0;
let SUPER_XTIME_STAKE_TOTAL = "0";

function bindBtnEvents() {
	$("#btn-swap").click(function () {
		checkSwapInputValue();
		hidePageShowSwap();
		$("#swap-window").removeClass("hide");
		$("#pool-window").addClass("hide");
		$("#stake-window").addClass("hide");
	});

	$("#btn-pool").click(function () {
		hidePageShowSwap();
		$("#swap-window").addClass("hide");
		$("#pool-window").removeClass("hide");
		$("#stake-window").addClass("hide");
	});

	$("#btn-stake").click(function () {
		hidePageShowSwap();
		$("#swap-window").addClass("hide");
		$("#pool-window").addClass("hide");
		$("#stake-window").removeClass("hide");
	});

	handleConnectWalletEvent();

	handleSwapInputEvent();

	handleLiquidityEvent();

	handleStakeInputEvent();

	handleStakeXTimeInputEvent();

	handleNewStakeXTimeInputEvent();

	handleSuperStakeXTimeInputEvent();

	// confirm swap
	$("#btn-confirm-swap").click(function () {
		if (SWAP_WAY === 1) {
			swapBNBToXTime().then(() => {
				showSuccessInfo("Swap Success!", "You transaction is on the way");
			}).catch((error) => {
				console.log(error);
				showAlert("Swap Failed!", error.message)
			});
		} else {
			swapXTimeToBNB().then(() => {
				showSuccessInfo("Swap Success!", "You transaction is on the way");
			}).catch((error) => {
				console.log(error);
				showAlert("Swap Failed!", error.message)
			})
		}
	});

	// confirm supply Liquidity
	$("#btn-poll-confirm-supply").click(function () {
		addLiquidity().then(() => {
			$("#btn-poll-add-back").click();
			showSuccessInfo("Supply Success!", "You transaction is on the way");
		}).catch((error) => {
			showAlert("Supply Failed!", error.message)
		})
	});

	// confirm remove liquidity
	$("#btn-confirm-remove-liquidity").click(function () {
		removeLiquidity().then(() => {
			$("#btn-poll-remove-back").click();
			showSuccessInfo("Remove Success!", "You transaction is on the way");
		}).catch((error) => {
			showAlert("Remove Failed!", error.message)
		})
	})

	// enable stake
	$("#btn-enable-stake").click(function () {
		enablePairTokenAllowance(STAKE_CONTRACT_ADDRESS).then(() => {
			getPairAllowance(CURRENT_ADDRESS, STAKE_CONTRACT_ADDRESS).then((result) => {
				console.log(result);
			})
		}).catch((error) => {
			console.log(error);
		})
	});

	// enable xtime stake
	$("#btn-enable-stake-xtime").click(function () {
		enableXTimeStake(STAKE_XTIME_CONTRACT_ADDRESS).then(() => {
			getXTimeStakeAllowance(CURRENT_ADDRESS, STAKE_XTIME_CONTRACT_ADDRESS).then((result) => {
				console.log(result);
			})
		})
	})

	// enable new xtime stake
	$("#new-btn-enable-stake-xtime").click(function () {
		enableXTimeStake(NEW_STAKE_XTIME_CONTRACT_ADDRESS).then(() => {
			getNewXTimeStakeAllowance(CURRENT_ADDRESS, NEW_STAKE_XTIME_CONTRACT_ADDRESS).then((result) => {
				console.log(result);
			})
		})
	})

	// enable super xtime stake
	$("#super-btn-enable-stake-xtime").click(function () {
		enableXTimeStake(SUPER_STAKE_XTIME_CONTRACT_ADDRESS).then(() => {
			getSuperXTimeStakeAllowance(CURRENT_ADDRESS, SUPER_STAKE_XTIME_CONTRACT_ADDRESS).then((result) => {
				console.log(result);
			})
		})
	})

	// confirm change stake
	$("#confirm-change-stake").click(function () {
		if (STAKE_CHANGE_WAY === 1) {
			depositStake(STAKE_CHANGE_VALUE.toString()).then((result) => {
				console.log(result);
				showSuccessInfo("Deposit Success!", "You transaction is on the way");
				$("#change-stake").modal('toggle');
			}).catch((error) => {
				console.log(error);
				showAlert("Deposit Failed!", error.message)
			})
		} else {
			withdrawStake(STAKE_CHANGE_VALUE.toString()).then((result) => {
				console.log(result);
				showSuccessInfo("Withdraw Success!", "You transaction is on the way");
				$("#change-stake").modal('toggle');
			}).catch((error) => {
				console.log(error);
				showAlert("Withdraw Failed!", error.message)
			})
		}
	})

	// confirm change xtime stake
	$("#confirm-change-xtime-stake").click(function () {
		if (STAKE_CHANGE_WAY === 1) {
			depositXTimeStake(XTIME_STAKE_CHANGE_VALUE.toString()).then((result) => {
				console.log(result);
				showSuccessInfo("Deposit Success!", "You transaction is on the way");
				$("#change-xtime-stake").modal('toggle');
			}).catch((error) => {
				console.log(error);
				showAlert("Deposit Failed!", error.message)
			})
		} else {
			withdrawXTimeStake(XTIME_STAKE_CHANGE_VALUE.toString()).then((result) => {
				console.log(result);
				showSuccessInfo("Withdraw Success!", "You transaction is on the way");
				$("#change-xtime-stake").modal('toggle');
			}).catch((error) => {
				console.log(error);
				showAlert("Withdraw Failed!", error.message)
			})
		}
	})

	// confirm change new xtime stake
	$("#new-confirm-change-xtime-stake").click(function () {
		if (STAKE_CHANGE_WAY === 1) {
			depositNewXTimeStake(NEW_XTIME_STAKE_CHANGE_VALUE.toString()).then((result) => {
				console.log(result);
				showSuccessInfo("Deposit Success!", "You transaction is on the way");
				$("#new-change-xtime-stake").modal('toggle');
			}).catch((error) => {
				console.log(error);
				showAlert("Deposit Failed!", error.message)
			})
		} else {
			withdrawNewXTimeStake(NEW_XTIME_STAKE_CHANGE_VALUE.toString()).then((result) => {
				console.log(result);
				showSuccessInfo("Withdraw Success!", "You transaction is on the way");
				$("#new-change-xtime-stake").modal('toggle');
			}).catch((error) => {
				console.log(error);
				showAlert("Withdraw Failed!", error.message)
			})
		}
	})

	// confirm change super xtime stake
	$("#super-confirm-change-xtime-stake").click(function () {
		if (STAKE_CHANGE_WAY === 1) {
			depositSuperXTimeStake(SUPER_XTIME_STAKE_CHANGE_VALUE.toString()).then((result) => {
				console.log(result);
				showSuccessInfo("Deposit Success!", "You transaction is on the way");
				$("#super-change-xtime-stake").modal('toggle');
			}).catch((error) => {
				console.log(error);
				showAlert("Deposit Failed!", error.message)
			})
		} else {
			withdrawSuperXTimeStake(SUPER_XTIME_STAKE_CHANGE_VALUE.toString()).then((result) => {
				console.log(result);
				showSuccessInfo("Withdraw Success!", "You transaction is on the way");
				$("#super-change-xtime-stake").modal('toggle');
			}).catch((error) => {
				console.log(error);
				showAlert("Withdraw Failed!", error.message)
			})
		}
	})

	// confirm harvest
	$("#confirm-harvest").click(function () {
		depositStake("0").then((result) => {
			console.log(result);
			showSuccessInfo("Harvest Success!", "You transaction is on the way");
		}).catch((error) => {
			console.log(error);
			showAlert("Harvest Failed!", error.message);
		})
	})

	// confirm harvest xtime
	$("#confirm-xtime-harvest").click(function () {
		depositXTimeStake("0").then((result) => {
			console.log(result);
			showSuccessInfo("Harvest Success!", "You transaction is on the way");
		}).catch((error) => {
			console.log(error);
			showAlert("Harvest Failed!", error.message);
		})
	})

	// confirm harvest new xtime
	$("#new-confirm-xtime-harvest").click(function () {
		depositNewXTimeStake("0").then((result) => {
			console.log(result);
			showSuccessInfo("Harvest Success!", "You transaction is on the way");
		}).catch((error) => {
			console.log(error);
			showAlert("Harvest Failed!", error.message);
		})
	})

	// confirm harvest super xtime
	$("#super-confirm-xtime-harvest").click(function () {
		depositSuperXTimeStake("0").then((result) => {
			console.log(result);
			showSuccessInfo("Harvest Success!", "You transaction is on the way");
		}).catch((error) => {
			console.log(error);
			showAlert("Harvest Failed!", error.message);
		})
	})
}

function handleConnectWalletEvent() {
	// swap connect wallet
	$("#btn-connect-wallet").click(function () {
		connectWallet().then(connectedWallet).catch(error => {
			console.log(error);
			showAlert("Connect Wallet Failed!", error.message);
		})
	});

	// poll connect wallet
	$("#btn-poll-connect-wallet").click(function () {
		connectWallet().then(connectedWallet).catch(error => {
			console.log(error);
			showAlert("Connect Wallet Failed!", error.message);
		})
	});
}

function handleSwapInputEvent() {
	// exchange swap coin from to
	$("#btn-exchange").click(function () {
		switch (SWAP_WAY) {
		case 1:
			$("#btn-swap-from").html(`<img class="token-icon" src="assets/icon/xtime.png">XTime`);
			$("#btn-swap-to").html(`<img class=\"token-icon\" src=\"assets/icon/bnb.png\">BNB`);
			SWAP_WAY = 2;
			break;
		case 2:
			$("#btn-swap-from").html(`<img class=\"token-icon\" src=\"assets/icon/bnb.png\">BNB`);
			$("#btn-swap-to").html(`<img class="token-icon" src="assets/icon/xtime.png">XTime`);
			SWAP_WAY = 1;
			break;
		}

		$("#input-swap-from").val(SWAP_TO_VALUE);
		$("#input-swap-to").val(SWAP_FROM_VALUE);

		SWAP_TO_VALUE = $("#input-swap-to").val();
		SWAP_FROM_VALUE = $("#input-swap-from").val();
		showBalance();
	})

	// change the swap from value
	$("#input-swap-from").on("input", function () {
		SWAP_FROM_VALUE = $(this).val();
		SWAP_TO_VALUE = calculateSwapToNumber();
		$("#input-swap-to").val(parseFloat(SWAP_TO_VALUE).toFixed(6));
		checkSwapInputValue();
	})

	$("#input-swap-to").on("input", function () {
		SWAP_TO_VALUE = $(this).val();
		SWAP_FROM_VALUE = calculateSwapFromNumber();
		$("#input-swap-from").val(parseFloat(SWAP_FROM_VALUE).toFixed(6));
		checkSwapInputValue();
	})
}

function handleLiquidityEvent() {
	// add Liquidity
	$("#btn-join-poll").click(function () {
		$("#window-body-poll-liquidity").addClass("hide")
		$("#window-body-poll-add").removeClass("hide")
	})

	// from add liquidity back
	$("#btn-poll-add-back").click(function () {
		$("#window-body-poll-liquidity").removeClass("hide")
		$("#window-body-poll-add").addClass("hide")
	})

	// remove liquidity
	$("#btn-remove-liquidity").click(function () {
		$("#window-body-poll-liquidity").addClass("hide");
		$("#window-body-poll-remove").removeClass("hide");
	})

	// change the poll value
	$("#input-poll-A").on("input", function () {
		POLL_AMOUNT_BNB = $(this).val();
		calculatePollXTimeNumber();
		checkPollInputValue();
	})

	$("#input-poll-B").on("input", function () {
		POLL_AMOUNT_XTIME = $(this).val();
		calculatePollBNBNumber();
		checkPollInputValue();
	})

	$("#btn-poll-remove-back").click(function () {
		$("#window-body-poll-liquidity").removeClass("hide");
		$("#window-body-poll-remove").addClass("hide");
	})

	// input remove liquidity value
	$("#remove-liquidity-btn-percent-25").click(function () {
		REMOVE_LIQUIDITY_PERCENT = 25;
		$("#input-poll-liquidity").val(REMOVE_LIQUIDITY_PERCENT);
		showLiquidityPay();
	})

	$("#remove-liquidity-btn-percent-50").click(function () {
		REMOVE_LIQUIDITY_PERCENT = 50;
		$("#input-poll-liquidity").val(REMOVE_LIQUIDITY_PERCENT);
		showLiquidityPay();
	})

	$("#remove-liquidity-btn-percent-75").click(function () {
		REMOVE_LIQUIDITY_PERCENT = 75;
		$("#input-poll-liquidity").val(REMOVE_LIQUIDITY_PERCENT);
		showLiquidityPay();
	})

	$("#remove-liquidity-btn-percent-100").click(function () {
		REMOVE_LIQUIDITY_PERCENT = 100;
		$("#input-poll-liquidity").val(REMOVE_LIQUIDITY_PERCENT);
		showLiquidityPay();
	})

	$("#input-poll-liquidity").on("input", function () {
		REMOVE_LIQUIDITY_PERCENT = $(this).val();
		if (REMOVE_LIQUIDITY_PERCENT > 100) {
			REMOVE_LIQUIDITY_PERCENT = 100;
			$("#input-poll-liquidity").val(REMOVE_LIQUIDITY_PERCENT);
		}

		switch (Number(REMOVE_LIQUIDITY_PERCENT)) {
		case 25:
			$(".btn-percent").removeClass("active");
			$("#remove-liquidity-btn-percent-25").addClass("active");
			break;
		case 50:
			$(".btn-percent").removeClass("active");
			$("#remove-liquidity-btn-percent-50").addClass("active");
			break;
		case 75:
			$(".btn-percent").removeClass("active");
			$("#remove-liquidity-btn-percent-75").addClass("active");
			break;
		case 100:
			$(".btn-percent").removeClass("active");
			$("#remove-liquidity-btn-percent-100").addClass("active");
			break;
		default:
			$(".btn-percent").removeClass("active");
		}

		showLiquidityPay();
	})
}

function handleStakeInputEvent() {
	$(".stake-container").on("click", "div.detail-btn", function (e) {
		let parent = $($(this).parents(".stake-container")[0]);
		if (parent.hasClass("open")) {
			parent.removeClass("open")
		} else {
			parent.addClass("open")
		}
	})

	// reduce stake
	$("#btn-increase-stake").click(function () {
		STAKE_CHANGE_WAY = 1;
		$("#change-stake-title").html("Stake XTime-BNB");
		$("#balance-change-stake").html(LIQUIDITY_BALANCE);
		$("#change-stake").modal('toggle');
	});

	// increase stake
	$("#btn-reduce-stake").click(function () {
		STAKE_CHANGE_WAY = 2;
		$("#change-stake-title").html("Unstake XTime-BNB");
		$("#balance-change-stake").html(STAKE_BALANCE);
		$("#change-stake").modal('toggle')
	});

	// percent input
	$("#change-stake-btn-percent-25").click(function () {
		STAKE_CHANGE_VALUE = calculateStakeValue(0.25);
		$("#input-change-stake").val(STAKE_CHANGE_VALUE);
		checkStakeInputValue(STAKE_CHANGE_VALUE);
	})

	$("#change-stake-btn-percent-50").click(function () {
		STAKE_CHANGE_VALUE = calculateStakeValue(0.5);
		$("#input-change-stake").val(STAKE_CHANGE_VALUE);
		checkStakeInputValue(STAKE_CHANGE_VALUE);
	})

	$("#change-stake-btn-percent-75").click(function () {
		STAKE_CHANGE_VALUE = calculateStakeValue(0.75);
		$("#input-change-stake").val(STAKE_CHANGE_VALUE);
		checkStakeInputValue(STAKE_CHANGE_VALUE);
	})

	$("#change-stake-btn-percent-100").click(function () {
		STAKE_CHANGE_VALUE = calculateStakeValue(1);
		$("#input-change-stake").val(STAKE_CHANGE_VALUE);
		checkStakeInputValue(STAKE_CHANGE_VALUE);
	})

	$("#input-change-stake").on("input", function () {
		STAKE_CHANGE_VALUE = $(this).val();
		checkStakeInputValue(STAKE_CHANGE_VALUE);
	})
}

function handleSuperStakeXTimeInputEvent() {
	// increase stake
	$("#super-btn-increase-stake-xtime").click(function () {
		STAKE_CHANGE_WAY = 1;
		$("#super-change-xtime-stake-title").html("Stake XTime");
		$("#super-balance-change-xtime-stake").html(XTIME_BALANCE);
		$("#super-change-xtime-stake").modal('toggle');
	});

	// reduce stake
	$("#super-btn-reduce-stake-xtime").click(function () {
		STAKE_CHANGE_WAY = 2;
		$("#super-change-xtime-stake-title").html("Unstake XTime");
		$("#super-balance-change-xtime-stake").html(bnToDisplayString(SUPER_XTIME_STAKE_BALANCE));
		$("#super-change-xtime-stake").modal('toggle')
	});

	// percent input
	$("#super-change-xtime-stake-btn-percent-25").click(function () {
		SUPER_XTIME_STAKE_CHANGE_VALUE = calculateSuperXTimeStakeValue(0.25);
		$("#super-input-change-xtime-stake").val(SUPER_XTIME_STAKE_CHANGE_VALUE);
		checkSuperXTimeStakeInputValue(SUPER_XTIME_STAKE_CHANGE_VALUE);
	})

	$("#super-change-xtime-stake-btn-percent-50").click(function () {
		SUPER_XTIME_STAKE_CHANGE_VALUE = calculateSuperXTimeStakeValue(0.5);
		$("#super-input-change-xtime-stake").val(SUPER_XTIME_STAKE_CHANGE_VALUE);
		checkSuperXTimeStakeInputValue(SUPER_XTIME_STAKE_CHANGE_VALUE);
	})

	$("#super-change-xtime-stake-btn-percent-75").click(function () {
		SUPER_XTIME_STAKE_CHANGE_VALUE = calculateSuperXTimeStakeValue(0.75);
		$("#super-input-change-xtime-stake").val(SUPER_XTIME_STAKE_CHANGE_VALUE);
		checkSuperXTimeStakeInputValue(SUPER_XTIME_STAKE_CHANGE_VALUE);
	})

	$("#super-change-xtime-stake-btn-percent-100").click(function () {
		SUPER_XTIME_STAKE_CHANGE_VALUE = calculateSuperXTimeStakeValue(1);
		$("#super-input-change-xtime-stake").val(SUPER_XTIME_STAKE_CHANGE_VALUE);
		checkSuperXTimeStakeInputValue(SUPER_XTIME_STAKE_CHANGE_VALUE);
	})

	$("#super-input-change-xtime-stake").on("input", function () {
		SUPER_XTIME_STAKE_CHANGE_VALUE = $(this).val();
		checkSuperXTimeStakeInputValue(SUPER_XTIME_STAKE_CHANGE_VALUE);
	})
}

function handleNewStakeXTimeInputEvent() {
	// increase stake
	$("#new-btn-increase-stake-xtime").click(function () {
		STAKE_CHANGE_WAY = 1;
		$("#new-change-xtime-stake-title").html("Stake XTime");
		$("#new-balance-change-xtime-stake").html(XTIME_BALANCE);
		$("#new-change-xtime-stake").modal('toggle');
	});

	// reduce stake
	$("#new-btn-reduce-stake-xtime").click(function () {
		STAKE_CHANGE_WAY = 2;
		$("#new-change-xtime-stake-title").html("Unstake XTime");
		$("#new-balance-change-xtime-stake").html(bnToDisplayString(NEW_XTIME_STAKE_BALANCE));
		$("#new-change-xtime-stake").modal('toggle')
	});

	// percent input
	$("#new-change-xtime-stake-btn-percent-25").click(function () {
		NEW_XTIME_STAKE_CHANGE_VALUE = calculateNewXTimeStakeValue(0.25);
		$("#new-input-change-xtime-stake").val(NEW_XTIME_STAKE_CHANGE_VALUE);
		checkNewXTimeStakeInputValue(NEW_XTIME_STAKE_CHANGE_VALUE);
	})

	$("#new-change-xtime-stake-btn-percent-50").click(function () {
		NEW_XTIME_STAKE_CHANGE_VALUE = calculateNewXTimeStakeValue(0.5);
		$("#new-input-change-xtime-stake").val(NEW_XTIME_STAKE_CHANGE_VALUE);
		checkNewXTimeStakeInputValue(NEW_XTIME_STAKE_CHANGE_VALUE);
	})

	$("#new-change-xtime-stake-btn-percent-75").click(function () {
		NEW_XTIME_STAKE_CHANGE_VALUE = calculateNewXTimeStakeValue(0.75);
		$("#new-input-change-xtime-stake").val(NEW_XTIME_STAKE_CHANGE_VALUE);
		checkNewXTimeStakeInputValue(NEW_XTIME_STAKE_CHANGE_VALUE);
	})

	$("#new-change-xtime-stake-btn-percent-100").click(function () {
		NEW_XTIME_STAKE_CHANGE_VALUE = calculateNewXTimeStakeValue(1);
		$("#new-input-change-xtime-stake").val(NEW_XTIME_STAKE_CHANGE_VALUE);
		checkNewXTimeStakeInputValue(NEW_XTIME_STAKE_CHANGE_VALUE);
	})

	$("#new-input-change-xtime-stake").on("input", function () {
		NEW_XTIME_STAKE_CHANGE_VALUE = $(this).val();
		checkNewXTimeStakeInputValue(NEW_XTIME_STAKE_CHANGE_VALUE);
	})
}

function handleStakeXTimeInputEvent() {
	// increase stake
	$("#btn-increase-stake-xtime").click(function () {
		STAKE_CHANGE_WAY = 1;
		$("#change-xtime-stake-title").html("Stake XTime");
		$("#balance-change-xtime-stake").html(XTIME_BALANCE);
		$("#change-xtime-stake").modal('toggle');
	});

	// reduce stake
	$("#btn-reduce-stake-xtime").click(function () {
		STAKE_CHANGE_WAY = 2;
		$("#change-xtime-stake-title").html("Unstake XTime");
		$("#balance-change-xtime-stake").html(bnToDisplayString(XTIME_STAKE_BALANCE));
		$("#change-xtime-stake").modal('toggle')
	});

	// percent input
	$("#change-xtime-stake-btn-percent-25").click(function () {
		XTIME_STAKE_CHANGE_VALUE = calculateXTimeStakeValue(0.25);
		$("#input-change-xtime-stake").val(XTIME_STAKE_CHANGE_VALUE);
		checkXTimeStakeInputValue(XTIME_STAKE_CHANGE_VALUE);
	})

	$("#change-xtime-stake-btn-percent-50").click(function () {
		XTIME_STAKE_CHANGE_VALUE = calculateXTimeStakeValue(0.5);
		$("#input-change-xtime-stake").val(XTIME_STAKE_CHANGE_VALUE);
		checkXTimeStakeInputValue(XTIME_STAKE_CHANGE_VALUE);
	})

	$("#change-xtime-stake-btn-percent-75").click(function () {
		XTIME_STAKE_CHANGE_VALUE = calculateXTimeStakeValue(0.75);
		$("#input-change-xtime-stake").val(XTIME_STAKE_CHANGE_VALUE);
		checkXTimeStakeInputValue(XTIME_STAKE_CHANGE_VALUE);
	})

	$("#change-xtime-stake-btn-percent-100").click(function () {
		XTIME_STAKE_CHANGE_VALUE = calculateXTimeStakeValue(1);
		$("#input-change-xtime-stake").val(XTIME_STAKE_CHANGE_VALUE);
		checkXTimeStakeInputValue(XTIME_STAKE_CHANGE_VALUE);
	})

	$("#input-change-xtime-stake").on("input", function () {
		XTIME_STAKE_CHANGE_VALUE = $(this).val();
		checkXTimeStakeInputValue(XTIME_STAKE_CHANGE_VALUE);
	})
}

function connectedWallet(web3) {
	window.web3 = web3;
	if (web3.currentProvider.chainId !== "0x38") {
		addChain().then(() => {
			switchChain();
		});
	}
	initContract();
	CURRENT_ADDRESS = getCurrentAddress();

	// get BNB and XTime balance
	Promise.all([getBalance(CURRENT_ADDRESS), getXTimeBalance(CURRENT_ADDRESS)]).then((result) => {
		BNB_BALANCE = Web3.utils.fromWei(result[0])
		XTIME_BALANCE = Web3.utils.fromWei(result[1])
		showBalance();
	})

	// get liquidity balance
	Promise.all([
		getLiquidityTotalSupply(),
		getLiquidityBalance(CURRENT_ADDRESS),
		getPairReserves(),
		getStakeTotal(),
	]).then(result => {
		LIQUIDITY_TOTAL = Web3.utils.fromWei(result[0]);
		LIQUIDITY_BALANCE = Web3.utils.fromWei(result[1]);
		PAIR_RESERVES = [
			Web3.utils.fromWei(result[2].reserve0),
			Web3.utils.fromWei(result[2].reserve1),
		];

		showLiquidityInfo();

		STAKE_TOTAL = web3.utils.fromWei(result[3]);

		$("#stake-total").html(STAKE_TOTAL / LIQUIDITY_TOTAL * PAIR_RESERVES[0]);
	});

	Promise.all([
		getXTimeStakeTotal(),
		getXTimeStakeAllowance(CURRENT_ADDRESS, STAKE_XTIME_CONTRACT_ADDRESS),
		getXTimeSTakeUserInfo(CURRENT_ADDRESS),
		getXTimeStakePendingReward(CURRENT_ADDRESS),
	]).then(result => {
		XTIME_STAKE_TOTAL = Web3.utils.toBN(result[0]);
		$("#xtime-stake-total").html(bnToDisplayString(XTIME_STAKE_TOTAL));

		XTIME_STAKE_ALLOWANCE = Web3.utils.toBN(result[1]);
		showXTimeStakeButtons();

		XTIME_STAKE_BALANCE = Web3.utils.toBN(result[2].amount);
		showXTimeStakeBalance(XTIME_STAKE_BALANCE);

		let pending_reward = web3.utils.toBN(result[3]);
		$("#stake-xtime-earned-result").html(bnToDisplayString(pending_reward, 17));
	});

	Promise.all([
		getNewXTimeStakeTotal(),
		getNewXTimeStakeAllowance(CURRENT_ADDRESS, NEW_STAKE_XTIME_CONTRACT_ADDRESS),
		getNewXTimeSTakeUserInfo(CURRENT_ADDRESS),
		getNewXTimeStakePendingReward(CURRENT_ADDRESS),
	]).then(result => {
		NEW_XTIME_STAKE_TOTAL = Web3.utils.toBN(result[0]);
		$("#new-xtime-stake-total").html(bnToDisplayString(NEW_XTIME_STAKE_TOTAL));

		NEW_XTIME_STAKE_ALLOWANCE = Web3.utils.toBN(result[1]);
		showNewXTimeStakeButtons();

		NEW_XTIME_STAKE_BALANCE = Web3.utils.toBN(result[2].amount);
		showNewXTimeStakeBalance(NEW_XTIME_STAKE_BALANCE);

		let pending_reward = Web3.utils.toBN(result[3]);
		$("#new-stake-xtime-earned-result").html(bnToDisplayString(pending_reward, 17));

	});

	Promise.all([
		getSuperXTimeStakeTotal(),
		getSuperXTimeStakeAllowance(CURRENT_ADDRESS, SUPER_STAKE_XTIME_CONTRACT_ADDRESS),
		getSuperXTimeSTakeUserInfo(CURRENT_ADDRESS),
		getSuperXTimeStakePendingReward(CURRENT_ADDRESS),
	]).then(result => {
		SUPER_XTIME_STAKE_TOTAL = Web3.utils.toBN(result[0]);
		$("#super-xtime-stake-total").html(bnToDisplayString(SUPER_XTIME_STAKE_TOTAL));

		SUPER_XTIME_STAKE_ALLOWANCE = Web3.utils.toBN(result[1]);
		showSuperXTimeStakeButtons();

		SUPER_XTIME_STAKE_BALANCE = Web3.utils.toBN(result[2].amount);
		showSuperXTimeStakeBalance(SUPER_XTIME_STAKE_BALANCE);

		let pending_reward = Web3.utils.toBN(result[3]);
		$("#super-stake-xtime-earned-result").html(bnToDisplayString(pending_reward, 17));
	})

	getPairAllowance(CURRENT_ADDRESS, STAKE_CONTRACT_ADDRESS).then((result) => {
		PAIR_TOKEN_ALLOWANCE = new web3.utils.BN(result);
		showStakeButtons();
	});

	getStakeUserInfo(CURRENT_ADDRESS).then((result) => {
		STAKE_BALANCE = web3.utils.fromWei(result.amount);
		showStakeBalance(STAKE_BALANCE);
	});

	getStakePendingReward(CURRENT_ADDRESS).then((result) => {
		let pending_reward = web3.utils.fromWei(result);
		$("#stake-earned-result").html(parseFloat(pending_reward).toFixed(17));
	});

	listenEvent();

	calculateARP();

	setInterval(getXTimeToWBNBPrice, 5000)
	connectWalletSuccess()
}

function showLiquidityInfo() {
	if (LIQUIDITY_BALANCE > 0) {
		let info = calculateLiquidityInfo(1);
		let sharing = info[2] > 0.00001 ? info[2].toFixed(12) : "<0.001%";
		$("#liquidity-balance").html(LIQUIDITY_BALANCE);
		$("#liquidity-balance-bnb").html(info[0].toFixed(12));
		$("#liquidity-balance-xtime").html(info[1].toFixed(12));
		$("#liquidity-balance-sharing").html(sharing);
		$(".poll-body-content-detail").addClass("hide");
		$(".poll-body-liquidity-box").removeClass("hide");
	}
}

function showLiquidityPay() {
	if (REMOVE_LIQUIDITY_PERCENT > 0) {
		let info = calculateLiquidityInfo(REMOVE_LIQUIDITY_PERCENT / 100);
		$("#liquidity-get-balance-bnb").html(info[0].toFixed(12));
		$("#liquidity-get-balance-xtime").html(info[1].toFixed(12));
		$("#btn-confirm-remove-liquidity").attr("disabled", false);
	} else {
		$("#btn-confirm-remove-liquidity").attr("disabled", true);
	}
}

// 计算ARP
function calculateARP() {
	Promise.all([
		getPairReserves(),
		getLiquidityTotalSupply(),
		getStakeTotal(),
		getNewXTimeStakeTotal(),
		getXTimeStakeTotal(),
		getStakePairPerBlockReward(),
		getNewStakePerBlockReward(),
		getOldStakePerBlockReward(),
		getStakePairPerBlockReward(),
		getSuperXTimeStakeTotal(),
		getXTimeToWBNBPrice(),
		getBTCBToWBNBPrice(),
	]).then(result => {
		let pair_reserves = [
			Web3.utils.toBN(result[0].reserve0), // bnb
			Web3.utils.toBN(result[0].reserve1), // xtime
		];
		let liquidity_total = Web3.utils.toBN(result[1]);
		let stake_pair_total = Web3.utils.toBN(result[2]);
		let stake_new_xtime_total = Web3.utils.toBN(result[3]);
		let stake_old_xtime_total = Web3.utils.toBN(result[4]);
		let stake_super_xtime_total = Web3.utils.toBN(result[9]);

		let stake_pair_per_block_reward = Web3.utils.toBN(result[5]);
		let stake_new_xtime_per_block_reward = Web3.utils.toBN(result[6]);
		let stake_old_xtime_per_block_reward = Web3.utils.toBN(result[7]);
		let stake_super_xtime_per_block_reward = Web3.utils.toBN(result[8]);

		let xtime_price = Web3.utils.toBN(Web3.utils.toWei(XTIME_PRICE));

		let stake_pair_reward_total = ONE_YEAR_BLOCK_COUNT.mul(stake_pair_per_block_reward).mul(BTCB_PRICE);
		let stake_new_xtime_reward_total = ONE_YEAR_BLOCK_COUNT.mul(stake_new_xtime_per_block_reward).mul(BTCB_PRICE);
		let stake_old_xtime_reward_total = ONE_YEAR_BLOCK_COUNT.mul(stake_old_xtime_per_block_reward).mul(BTCB_PRICE);
		let stake_super_xtime_reward_total = ONE_YEAR_BLOCK_COUNT.mul(stake_super_xtime_per_block_reward).mul(BTCB_PRICE);

		let stake_pair_total_bnb = pair_reserves[0].mul(stake_pair_total).div(liquidity_total).mul(Web3.utils.toBN(2));
		let stake_new_xtime_total_bnb = (stake_new_xtime_total).div(xtime_price);
		let stake_old_xtime_total_bnb = (stake_old_xtime_total).div(xtime_price);
		let stake_super_xtime_total_bnb = (stake_super_xtime_total).div(xtime_price);

		let stake_pair_arp = stake_pair_reward_total.div(stake_pair_total_bnb).mul(Web3.utils.toBN(100));
		let stake_new_xtime_arp = stake_new_xtime_reward_total.div(stake_new_xtime_total_bnb).mul(Web3.utils.toBN(100));
		let stake_old_xtime_arp = stake_old_xtime_reward_total.div(stake_old_xtime_total_bnb).mul(Web3.utils.toBN(100));
		let stake_super_xtime_arp = stake_super_xtime_reward_total.div(stake_super_xtime_total_bnb).mul(Web3.utils.toBN(100));

		console.log(Web3.utils.fromWei(stake_super_xtime_arp.toString()).split(".")[0]);

		let stake_pair_arp_string = parseFloat(Web3.utils.fromWei(stake_pair_arp)).toFixed(3) + "%";
		let stake_new_xtime_arp_string = parseFloat(Web3.utils.fromWei(Math.floor(Web3.utils.fromWei(stake_new_xtime_arp)).toString())).toFixed(8) + "%";
		let stake_old_xtime_arp_string = parseFloat(Web3.utils.fromWei(Math.floor(Web3.utils.fromWei(stake_old_xtime_arp)).toString())).toFixed(8) + "%";
		let stake_super_xtime_arp_string = parseFloat(Web3.utils.fromWei(Web3.utils.fromWei(stake_super_xtime_arp).split(".")[0])).toFixed(8) + "%";

		$("#stake-pair-arp").html(stake_pair_arp_string);
		$("#stake-new-xtime-arp").html(stake_new_xtime_arp_string);
		$("#stake-old-xtime-arp").html(stake_old_xtime_arp_string);
		$("#stake-super-xtime-arp").html(stake_super_xtime_arp_string);
	})
}

function calculateLiquidityInfo(percent) {
	let value = percent * LIQUIDITY_BALANCE;
	let bnb = value / LIQUIDITY_TOTAL * PAIR_RESERVES[0];
	let xtime = value / LIQUIDITY_TOTAL * PAIR_RESERVES[1];
	return [bnb, xtime, value / LIQUIDITY_TOTAL];
}

function showBalance() {
	if (SWAP_WAY === 1) {
		$("#label-balance-from").html(`Balance: ${parseFloat(BNB_BALANCE).toFixed(6)}`);
		$("#label-balance-from").removeClass("hide");
		$("#label-balance-to").html(`Balance: ${parseFloat(XTIME_BALANCE).toFixed(6)}`);
		$("#label-balance-to").removeClass("hide");
	} else {
		$("#label-balance-from").html(`Balance: ${parseFloat(XTIME_BALANCE).toFixed(6)}`);
		$("#label-balance-from").removeClass("hide");
		$("#label-balance-to").html(`Balance: ${parseFloat(BNB_BALANCE).toFixed(6)}`);
		$("#label-balance-to").removeClass("hide");
	}

	$("#label-poll-balance-A").html(`Balance: ${BNB_BALANCE}`);
	$("#label-poll-balance-B").html(`Balance: ${XTIME_BALANCE}`);
}

function calculateSwapToNumber() {
	if (SWAP_WAY === 1) {
		return SWAP_FROM_VALUE === "" ? "" : (SWAP_FROM_VALUE * XTIME_PRICE).toFixed(18);
	} else {
		return SWAP_FROM_VALUE === "" ? "" : (SWAP_FROM_VALUE / XTIME_PRICE).toFixed(18);
	}
}

function calculateSwapFromNumber() {
	if (SWAP_WAY === 1) {
		return SWAP_TO_VALUE === "" ? "" : SWAP_TO_VALUE / XTIME_PRICE;
	} else {
		return SWAP_TO_VALUE === "" ? "" : SWAP_TO_VALUE * XTIME_PRICE;
	}
}

function calculatePollXTimeNumber() {
	if (POLL_AMOUNT_BNB === "") {
		POLL_AMOUNT_XTIME = "";
	} else {
		POLL_AMOUNT_XTIME = (POLL_AMOUNT_BNB * XTIME_PRICE).toFixed(18);
	}
	$("#input-poll-B").val(POLL_AMOUNT_XTIME);
}

function calculatePollBNBNumber() {
	if (POLL_AMOUNT_XTIME === "") {
		POLL_AMOUNT_BNB = "";
	} else {
		POLL_AMOUNT_BNB = (POLL_AMOUNT_XTIME / XTIME_PRICE).toFixed(18);
	}
	$("#input-poll-A").val(POLL_AMOUNT_BNB);
}

function checkPollInputValue() {
	if (parseFloat(POLL_AMOUNT_BNB) > 0 && parseFloat(POLL_AMOUNT_XTIME) > 0 && parseFloat(POLL_AMOUNT_BNB) <= parseFloat(BNB_BALANCE) && parseFloat(POLL_AMOUNT_XTIME) <= parseFloat(XTIME_BALANCE)) {
		$("#btn-poll-confirm-supply").attr("disabled", false);
	} else {
		$("#btn-poll-confirm-supply").attr("disabled", true);
	}
}

function checkSwapInputValue() {
	if (SWAP_FROM_VALUE > 0 && SWAP_TO_VALUE > 0) {
		if (SWAP_WAY === 1 && parseFloat(SWAP_FROM_VALUE) <= parseFloat(BNB_BALANCE)) {
			$("#btn-confirm-swap").attr("disabled", false);
			$("#btn-confirm-swap").html("Swap");
			return;
		} else if (SWAP_WAY === 2 && parseFloat(SWAP_FROM_VALUE) <= parseFloat(XTIME_BALANCE)) {
			$("#btn-confirm-swap").attr("disabled", false);
			$("#btn-confirm-swap").html("Swap");
			return;
		}
	}

	$("#btn-confirm-swap").attr("disabled", true);
	$("#btn-confirm-swap").html("Insufficient BNB balance");
}

function connectWalletSuccess() {
	$("#btn-connect-wallet").addClass("hide");
	$("#btn-poll-connect-wallet").addClass("hide");
	$("#btn-confirm-swap").removeClass("hide");
	$("#btn-poll-confirm-supply").removeClass("hide");
}

function hidePageShowSwap() {
	if ($(".swap-container").hasClass("hide")) {
		$(".index-container").addClass("hide");
		$(".swap-container").removeClass("hide");
	}
}

function showStakeButtons() {
	if (PAIR_TOKEN_ALLOWANCE.gt(new web3.utils.BN("0"))) {
		$("#btn-enable-stake").addClass("hide");
		$("#btn-increase-stake").removeClass("hide");
		$("#btn-reduce-stake").removeClass("hide");
	} else {
		$("#btn-enable-stake").removeClass("hide");
		$("#btn-increase-stake").addClass("hide");
		$("#btn-reduce-stake").addClass("hide");
	}
}

function showSuperXTimeStakeButtons() {
	if (SUPER_XTIME_STAKE_ALLOWANCE.gt(new web3.utils.BN("0"))) {
		$("#super-btn-enable-stake-xtime").addClass("hide");
		$("#super-btn-increase-stake-xtime").removeClass("hide");
		$("#super-btn-reduce-stake-xtime").removeClass("hide");
	} else {
		$("#super-btn-enable-stake-xtime").removeClass("hide");
		$("#super-btn-increase-stake-xtime").addClass("hide");
		$("#super-btn-reduce-stake-xtime").addClass("hide");
	}
}

function showNewXTimeStakeButtons() {
	if (NEW_XTIME_STAKE_ALLOWANCE.gt(new web3.utils.BN("0"))) {
		$("#new-btn-enable-stake-xtime").addClass("hide");
		$("#new-btn-increase-stake-xtime").removeClass("hide");
		$("#new-btn-reduce-stake-xtime").removeClass("hide");
	} else {
		$("#new-btn-enable-stake-xtime").removeClass("hide");
		$("#new-btn-increase-stake-xtime").addClass("hide");
		$("#new-btn-reduce-stake-xtime").addClass("hide");
	}
}

function showXTimeStakeButtons() {
	if (XTIME_STAKE_ALLOWANCE.gt(new web3.utils.BN("0"))) {
		$("#btn-enable-stake-xtime").addClass("hide");
		$("#btn-increase-stake-xtime").removeClass("hide");
		$("#btn-reduce-stake-xtime").removeClass("hide");
	} else {
		$("#btn-enable-stake-xtime").removeClass("hide");
		$("#btn-increase-stake-xtime").addClass("hide");
		$("#btn-reduce-stake-xtime").addClass("hide");
	}
}

function showStakeBalance(value) {
	$("#stake-staked-result").html(parseFloat(value).toFixed(6));
}

function showXTimeStakeBalance(value) {
	$("#stake-xtime-staked-result").html(bnToDisplayString(value));
}

function showNewXTimeStakeBalance(value) {
	$("#new-stake-xtime-staked-result").html(bnToDisplayString(value));
}

function showSuperXTimeStakeBalance(value) {
	$("#super-stake-xtime-staked-result").html(bnToDisplayString(value));
}

function calculateStakeValue(percent) {
	let result;

	if (STAKE_CHANGE_WAY === 1) {
		result = LIQUIDITY_BALANCE * percent;
	} else {
		result = STAKE_BALANCE * percent;
	}
	return result;
}

function checkStakeInputValue(value) {
	let wei_value = new web3.utils.BN(web3.utils.toWei(value.toString()));
	let wei_liquidity_balance = new web3.utils.BN(web3.utils.toWei(LIQUIDITY_BALANCE));
	let wei_stake_balance = new web3.utils.BN(web3.utils.toWei(STAKE_BALANCE));

	if (STAKE_CHANGE_WAY === 1 && wei_value.lte(wei_liquidity_balance)) {
		$("#confirm-change-stake").attr("disabled", false);
	} else if (STAKE_CHANGE_WAY === 2 && wei_value.lte(wei_stake_balance)) {
		$("#confirm-change-stake").attr("disabled", false);
	} else {
		$("#confirm-change-stake").attr("disabled", true);
	}
}

function calculateXTimeStakeValue(percent) {
	let result;

	if (STAKE_CHANGE_WAY === 1) {
		result = XTIME_BALANCE * percent;
	} else {
		result = Web3.utils.fromWei(XTIME_STAKE_BALANCE.toString()) * percent;
	}
	return result;
}

function calculateNewXTimeStakeValue(percent) {
	let result;

	if (STAKE_CHANGE_WAY === 1) {
		result = XTIME_BALANCE * percent;
	} else {
		result = Web3.utils.fromWei(NEW_XTIME_STAKE_BALANCE.toString()) * percent;
	}
	return result;
}

function calculateSuperXTimeStakeValue(percent) {
	let result;

	if (STAKE_CHANGE_WAY === 1) {
		result = XTIME_BALANCE * percent;
	} else {
		result = Web3.utils.fromWei(SUPER_XTIME_STAKE_BALANCE.toString()) * percent;
	}
	return result;
}

function checkXTimeStakeInputValue(value) {
	let wei_value = new web3.utils.BN(web3.utils.toWei(value.toString()));
	let wei_liquidity_balance = new web3.utils.BN(web3.utils.toWei(XTIME_BALANCE));
	let wei_stake_balance = new web3.utils.BN(web3.utils.toWei(XTIME_STAKE_BALANCE));

	if (STAKE_CHANGE_WAY === 1 && wei_value.lte(wei_liquidity_balance)) {
		$("#confirm-change-xtime-stake").attr("disabled", false);
	} else if (STAKE_CHANGE_WAY === 2 && wei_value.lte(wei_stake_balance)) {
		$("#confirm-change-xtime-stake").attr("disabled", false);
	} else {
		$("#confirm-change-xtime-stake").attr("disabled", true);
	}
}

function checkSuperXTimeStakeInputValue(value) {
	let wei_value = new web3.utils.BN(web3.utils.toWei(value.toString()));
	let wei_liquidity_balance = new web3.utils.BN(web3.utils.toWei(XTIME_BALANCE));
	let wei_stake_balance = new web3.utils.BN(web3.utils.toWei(SUPER_XTIME_STAKE_BALANCE));

	if (STAKE_CHANGE_WAY === 1 && wei_value.lte(wei_liquidity_balance)) {
		$("#super-confirm-change-xtime-stake").attr("disabled", false);
	} else if (STAKE_CHANGE_WAY === 2 && wei_value.lte(wei_stake_balance)) {
		$("#super-confirm-change-xtime-stake").attr("disabled", false);
	} else {
		$("#super-confirm-change-xtime-stake").attr("disabled", true);
	}
}

function checkNewXTimeStakeInputValue(value) {
	let wei_value = new web3.utils.BN(web3.utils.toWei(value.toString()));
	let wei_liquidity_balance = new web3.utils.BN(web3.utils.toWei(XTIME_BALANCE));
	let wei_stake_balance = new web3.utils.BN(web3.utils.toWei(NEW_XTIME_STAKE_BALANCE));

	if (STAKE_CHANGE_WAY === 1 && wei_value.lte(wei_liquidity_balance)) {
		$("#new-confirm-change-xtime-stake").attr("disabled", false);
	} else if (STAKE_CHANGE_WAY === 2 && wei_value.lte(wei_stake_balance)) {
		$("#new-confirm-change-xtime-stake").attr("disabled", false);
	} else {
		$("#new-confirm-change-xtime-stake").attr("disabled", true);
	}
}

// change the deadline
$("#input-deadline").on("input", function (e) {
	DEADLINE_TIME = $("#input-deadline").val() * 60;
})

$("#input-percent").on("input", function () {
	let value = Number($("#input-percent").val());

	if (value >= 100) {
		value = 100;
		$("#input-percent").val(100);
	}

	switch (value) {
	case 10:
		$(".btn-percent").removeClass("active");
		$("#btn-percent-10").addClass("active");
		break;
	case 15:
		$(".btn-percent").removeClass("active");
		$("#btn-percent-15").addClass("active");
		break;
	case 25:
		$(".btn-percent").removeClass("active");
		$("#btn-percent-25").addClass("active");
		break;
	default:
		$(".btn-percent").removeClass("active");
	}
	SLIPPAGE = value;
})

// click button change slippage
function settingPercentChange() {
	$("#btn-percent-10").click(function () {
		$(".btn-percent").removeClass("active");
		$(this).addClass("active");
		$("#input-percent").val(10);
		SLIPPAGE = 10;
	})

	$("#btn-percent-15").click(function () {
		$(".btn-percent").removeClass("active");
		$(this).addClass("active");
		$("#input-percent").val(15);
		SLIPPAGE = 15;
	})

	$("#btn-percent-25").click(function () {
		$(".btn-percent").removeClass("active");
		$(this).addClass("active");
		$("#input-percent").val(25);
		SLIPPAGE = 25;
	})
}

function bnToDisplayString(value_bn, length) {
	length = length ? length : 6;
	return parseFloat(Web3.utils.fromWei(value_bn.toString())).toFixed(length)
}