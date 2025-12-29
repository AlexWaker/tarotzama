// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

// 引入 Zama FHEVM Solidity 库
import {FHE, euint8, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Tarot - Encrypted on-chain tarot reading using Zama FHEVM
/// @notice Stores tarot draws as encrypted card ids + orientations on-chain.
contract Tarot is ZamaEthereumConfig {
    
    /// @notice 塔罗牌总数
    uint8 public constant DECK_SIZE = 78;

    struct Reading {
        uint256 id;
        address querent;
        uint256 timestamp;
        uint8 spreadType;
        
        // 这里的 euint8 是 encrypted uint8，只有持有密钥的人能解密
        euint8[] encryptedCardIds;
        ebool[] encryptedIsReversed; 
        
        bool isFulfilled;
    }

    uint256 public nextReadingId;
    mapping(uint256 => Reading) public readings;
    mapping(address => uint256[]) public userReadingIds;

    event ReadingRequested(uint256 indexed readingId, address indexed querent);

    /**
     * @notice 请求占卜
     * @dev 使用链上伪随机数生成牌面 ID 与正逆位，然后加密存储。
     *      注意：随机性安全性仅适用于娱乐 / Demo，不适合高价值博彩场景。
     */
    function requestReading(uint8 _spreadType) external returns (uint256) {
        uint256 readingId = nextReadingId++;
        
        Reading storage reading = readings[readingId];
        reading.id = readingId;
        reading.querent = msg.sender;
        reading.timestamp = block.timestamp;
        reading.spreadType = _spreadType;
        
        // 确定抽牌数量（0: 单张, 1: 三张, 2: 五张）
        uint8 cardsToDraw = 1; 
        if (_spreadType == 1) cardsToDraw = 3;
        else if (_spreadType == 2) cardsToDraw = 5; 

        // --- 伪随机种子（仅在本地开发链 31337 上使用） ---
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.prevrandao,
                    msg.sender,
                    readingId
                )
            )
        );

        // --- 抽牌并加密存储 ---
        for (uint8 i = 0; i < cardsToDraw; i++) {
            euint8 cardId;
            ebool isReversed;

            if (block.chainid == 31337) {
                // 👉 本地 Hardhat 开发链：使用链上伪随机数，然后加密存储（方便开发调试）
                // 1. 生成 0..DECK_SIZE-1 的明文牌 ID
                seed = uint256(keccak256(abi.encodePacked(seed, i)));
                uint8 clearCardId = uint8(seed % DECK_SIZE);

                // 2. 生成明文正逆位布尔
                seed = uint256(keccak256(abi.encodePacked(seed, "reversed")));
                bool clearReversed = (seed & 1) == 1;

                // 3. 转为加密类型
                cardId = FHE.asEuint8(clearCardId);
                isReversed = FHE.asEbool(clearReversed);
            } else {
                // 👉 生产 / 公网（Sepolia / mainnet）：使用 FHEVM 提供的加密随机数
                // NOTE: randEuint8(upperBound) 要求 upperBound 为 2 的幂；DECK_SIZE=78 不是 2 的幂
                // 因此使用 randEuint8() 再对 78 取余（存在轻微偏差，但对 Demo 足够）
                cardId = FHE.rem(FHE.randEuint8(), DECK_SIZE);
                isReversed = FHE.randEbool();
            }

            // 4. 存入结构体
            reading.encryptedCardIds.push(cardId);
            reading.encryptedIsReversed.push(isReversed);

            // 5. 设置 ACL：允许合约自身与当前调用者使用/解密
            FHE.allowThis(cardId);
            FHE.allowThis(isReversed);
            
            FHE.allow(cardId, msg.sender);
            FHE.allow(isReversed, msg.sender);
        }

        reading.isFulfilled = true;
        userReadingIds[msg.sender].push(readingId);

        emit ReadingRequested(readingId, msg.sender);
        return readingId;
    }

    function getReading(uint256 _readingId) external view returns (
        uint256 id,
        uint256 timestamp,
        uint8 spreadType,
        euint8[] memory encryptedCardIds,
        ebool[] memory encryptedIsReversed
    ) {
        Reading storage r = readings[_readingId];
        return (
            r.id,
            r.timestamp,
            r.spreadType,
            r.encryptedCardIds,
            r.encryptedIsReversed
        );
    }
}