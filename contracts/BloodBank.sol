// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BloodBank {
    struct Donor {
        string name;
        uint age;
        string bloodType;
        string location;
        bool isAvailable;
    }

    mapping(address => Donor) public donors;
    address[] public donorList;

    event DonorRegistered(address indexed donorAddress, string name, string bloodType);
    event BloodDonated(address indexed donorAddress, string bloodType);

    function registerDonor(
        string memory _name,
        uint _age,
        string memory _bloodType,
        string memory _location
    ) public {
        require(_age >= 18, "Donor must be at least 18 years old");

        donors[msg.sender] = Donor(_name, _age, _bloodType, _location, true);
        donorList.push(msg.sender);

        emit DonorRegistered(msg.sender, _name, _bloodType);
    }

    function donateBlood() public {
        require(donors[msg.sender].isAvailable, "Donor is not available");
        emit BloodDonated(msg.sender, donors[msg.sender].bloodType);
    }

    function getAllDonors() public view returns (address[] memory) {
        return donorList;
    }

    function getDonorDetails(address _donor) public view returns (string memory, uint, string memory, string memory, bool) {
        Donor memory d = donors[_donor];
        return (d.name, d.age, d.bloodType, d.location, d.isAvailable);
    }
}
