//
//  MainView.swift
//  CleanArea_TestDemo
//
//  Created by 김지훈 on 2023/12/11.
//

import Foundation
import SwiftUI

struct MainView: View {
    @ObservedObject var vm:APIViewModel = APIViewModel()

    var body: some View {
        Text("청년정책")
        List(vm.result, id: \.self) { policy in
            VStack(alignment: .leading) {
                Text("정책명: \(policy.polyBizSjnm)")
                Text("정책 소개: \(policy.polyItcnCn)")
                Text("지원 내용: \(policy.sporCn)")
                Text("지원 규모: \(policy.sporScvl)")
            }
        }
        .onAppear {
            vm.fetchYouthPolicies()
        }
    }
    
}
