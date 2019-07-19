package com.internship.tmontica.service;

import com.internship.tmontica.dto.Option;
import com.internship.tmontica.repository.OptionDao;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OptionService {


    private final OptionDao optionDao;


    // 옵션 하나 가져오기
    @Transactional(readOnly = true)
    public Option getOptionById(int id){
        return optionDao.getOptionById(id);
    }

    // 옵션 모두 가져오기
    @Transactional(readOnly = true)
    public List<Option> getAllOptions(){
        return optionDao.getAllOptions();
    }

    // 옵션 추가하기
    @Transactional
    public int addOption(Option option){
        return optionDao.addOption(option);
    }

    // 옵션 수정하기
    @Transactional
    public void updateOption(Option option){
        optionDao.updateOption(option);
    }

    // 옵션 삭제하기
    @Transactional
    public void deleteOption(int id){
        optionDao.deleteOption(id);
    }

}
